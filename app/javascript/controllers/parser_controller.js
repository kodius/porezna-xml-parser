// Visit The Stimulus Handbook for more details 
// https://stimulusjs.org/handbook/introduction
// 
// This example controller works with specially annotated HTML like:
//
// <div data-controller="hello">
//   <h1 data-target="hello.output"></h1>
// </div>

import Dropzone from "dropzone";
import { Controller } from "stimulus";
import { DirectUpload } from "@rails/activestorage";
import {
  getMetaValue,
  toArray,
  findElement,
  removeElement,
  insertAfter,
  addFileToTheList,
  addWrongFormatError,
  getFilenameExtension,
  addStatusIcon

} from "helpers";
export default class extends Controller {
  static targets = ["input"];

  connect() {
    this.sendBtn = document.getElementById('submit-button');
    this.removeFileBtn = document.querySelectorAll('.remove-icon-span')
    this.listOfAcceptedFiles = [];
    this.filedSlots = document.querySelectorAll('filed-file-slot')
    this.dropZone = createDropZone(this);
    this.hideFileInput();
    this.bindEvents();
    Dropzone.autoDiscover = false;
    // necessary quirk for Dropzone error in console
  }

  // Private
  hideFileInput() {
    this.inputTarget.disabled = true;
    this.inputTarget.style.display = "none";
  }

  bindEvents() {
    this.dropZone.on("addedfile", file => {
      let fileExtenstion = getFilenameExtension(file.name)
      if(fileExtenstion === 'xml') {
        this.listOfAcceptedFiles.push(file.name);
        this.sendBtn.classList += ' enabled-btn'
        this.sendBtn.disabled = false;
        addFileToTheList(this.listOfAcceptedFiles)
      } else {
        addWrongFormatError();
      }
    });

    this.dropZone.on("removedfile", file => {
      console.log('jesam')
      file.controller && removeElement(file.controller.hiddenInput);
    });

    this.dropZone.on("canceled", file => {
      file.controller && file.controller.xhr.abort();
    });

    for(let remove of this.removeFileBtn) {
      if(remove === undefined)  {
        return;
      }
    }
    // this.dropZone.on('drop', (file, event) => {
    //   debugger;
    // });

    // this.dropZone.on('error', (file, message, xhr) => {
    //   debugger;
    //   addWrongFormatError()
    // });


    // this.dropZone.on('sending', function(file, xhr, formData){
    //   debugger;
    //   formData.append('userName', 'bob');
    // });

    this.dropZone.on("success", function(file, response) {
      console.log(response)
      console.log(response['status'])
      if(response['status'] === 200) {
        window.location.href = '/download-xml?filename='+response["filename"];
      }
      addStatusIcon(response['status'])
    });

    this
}

  get headers() {
    return { "X-CSRF-Token": getMetaValue("csrf-token") };
  }

  get url() {
    return this.inputTarget.getAttribute("data-direct-upload-url");
  }

  get maxFiles() {
    return this.data.get("maxFiles") || 1;
  }

  get maxFileSize() {
    return this.data.get("maxFileSize") || 256;
  }

  get acceptedFiles() {
    return this.data.get("acceptedFiles");
  }

  get addRemoveLinks() {
    return this.data.get("addRemoveLinks") || true;
  }

  get listOfUploadFiles() {
    this.data.listOfUploadFiles = []
    return this.data.listOfUploadFiles;
  }

  get listOfUploadFiles() {
    this.data.listOfUploadFiles = []
    return this.data.listOfUploadFiles;
  }
}

// class DirectUploadController {
//   constructor(source, file) {
//     this.directUpload = createDirectUpload(file, source.url, this);
//     this.source = source;
//     this.file = file;
//   }

  // start() {
  //   this.file.controller = this;
  //   this.hiddenInput = this.createHiddenInput();
  //   this.directUpload.create((error, attributes) => {
  //     if (error) {
  //       removeElement(this.hiddenInput);
  //       this.emitDropzoneError(error);
  //     } else {
  //       this.hiddenInput.value = attributes.signed_id;
  //       this.emitDropzoneSuccess();
  //     }
  //   });
  // }

//   createHiddenInput() {
//     const input = document.createElement("input");
//     input.type = "hidden";
//     input.name = this.source.inputTarget.name;
//     insertAfter(input, this.source.inputTarget);
//     return input;
//   }

//   directUploadWillStoreFileWithXHR(xhr) {
//     this.bindProgressEvent(xhr);
//     this.emitDropzoneUploading();
//   }

//   bindProgressEvent(xhr) {
//     this.xhr = xhr;
//     this.xhr.upload.addEventListener("progress", event =>
//       this.uploadRequestDidProgress(event)
//     );
//   }

//   uploadRequestDidProgress(event) {
//     const element = this.source.element;
//     const progress = (event.loaded / event.total) * 100;
//     findElement(
//       this.file.previewTemplate,
//       ".dz-upload"
//     ).style.width = `${progress}%`;
//   }

//   emitDropzoneUploading() {
//     console.log('jesammm')
//     this.file.status = Dropzone.UPLOADING;
//     this.source.dropZone.emit("processing", this.file);
//   }

  // emitDropzoneError(error) {
  //   this.file.status = Dropzone.ERROR;
  //   this.source.dropZone.emit("error", this.file, error);
  //   this.source.dropZone.emit("complete", this.file);
  // }

//   emitDropzoneSuccess() {
//     this.file.status = Dropzone.SUCCESS;
//     this.source.dropZone.emit("success", this.file);
//     this.source.dropZone.emit("complete", this.file);
//   }
// }

function createDirectUploadController(source, file) {
  return new DirectUploadController(source, file);
}

function createDropZone(controller) {
  return new Dropzone(controller.element, {
    url: '/upload-xml',
    maxFiles: 10,
    uploadMultiple: true,
    parallelUploads: 1,
    maxFilesize: controller.maxFileSize,
    params: controller.listOfUploadFiles,
    addRemoveLinks: true,
    autoProcessQueue: false,
    acceptedFiles: '.xml',
    previewsContainer: false,
    params: controller.listOfUploadFiles,
    init: function() {
        var myDropzone = this;
        document.getElementById('file-upload-form').addEventListener("submit", function (e) {
            e.preventDefault();
            if(myDropzone.getQueuedFiles().length === 0)
            {
                alert("Please drop or select file to upload !!!");
            }
            else {
              myDropzone.getQueuedFiles().forEach(function(file,index) {
                setTimeout(function() {
                  myDropzone.processQueue(file)
                }, 5000*(index+1))
              });
            }
        });
    }
  });
}
