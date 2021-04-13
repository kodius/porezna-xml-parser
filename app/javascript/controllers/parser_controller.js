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
  getFilenameExtension,
  addStatusIcon,
  returnToInitial,
  disableSendBtnIfNoFile,
  replaceFile,
  addFileNotLoadedError,
  addErroMsg,
  hideErrorMsg
} from "helpers";
export default class extends Controller {
  static targets = ["input"];

  connect() {
    this.sendBtn = document.getElementById('submit-button');
    this.removeFileBtn = document.querySelectorAll('.remove-icon-span')
    this.addNewBtn = document.querySelectorAll('.add-icon-span');
    this.replaceBtn = document.querySelectorAll('.replace-icon-span');
    this.listOfAcceptedFiles = [];
    this.listOfRejectedFiles = [];
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
      let fileExtenstion = getFilenameExtension(file.name);
      if(fileExtenstion === 'xml') {
        this.listOfAcceptedFiles.push(file.name);
        if(this.listOfAcceptedFiles.length === 1) {
          this.sendBtn.classList += ' enabled-btn'
          this.sendBtn.disabled = false;
        }
        if(this.dropZone.options !== undefined && this.dropZone.options.params.length > 0) {
          replaceFile(this.dropZone.options.params[0])
          this.dropZone.options.params = [];
        }
        if(this.listOfAcceptedFiles.length > 3) {
          this.listOfRejectedFiles.push(file.name);
          addFileNotLoadedError(this.listOfRejectedFiles)
        }
        addFileToTheList(this.listOfAcceptedFiles, file.upload['uuid'])
      } else {
        addErroMsg('Krivi format druze');
      }
    });

    this.dropZone.on("removedfile", file => {
      disableSendBtnIfNoFile(this.dropZone.getAcceptedFiles(),  this.sendBtn);
    });

    this.dropZone.on("canceled", file => {
      file.controller && file.controller.xhr.abort();
    });

    for(let remove of this.removeFileBtn) {
      if(remove === undefined) return;

      remove.addEventListener('click', (e) => {
        const et = e.target.parentElement.parentElement;
        let elementUuid = et.dataset['uuid'];
        var numberOfRejectedFile = document.querySelectorAll('.rejected-file').length;
        if(numberOfRejectedFile === 1) document.getElementById('error-container').style.display = 'none';
        if(elementUuid !== undefined) {
          let fileToDelete = this.dropZone.getQueuedFiles().find(x => x.upload['uuid'] === elementUuid);
          if(fileToDelete !== undefined) this.dropZone.removeFile(fileToDelete)
          returnToInitial(et);
        }
      });
    }

    this.sendBtn.addEventListener('click', function() {
      this.listOfAcceptedFiles = [];
      this.listOfRejectedFiles = [];
      this.sendBtn.classList.remove('enabled-btn');
      hideErrorMsg();
    }.bind(this), false);

    for(let newBtn of this.addNewBtn) {
      newBtn.addEventListener('click', function() {
        document.getElementById('upload-zone').click();
      });
    }

    for(let [index,replaceBtn] of this.replaceBtn.entries()) {
      replaceBtn.addEventListener('click', function() {
        this.dropZone.options.params.push(index)
        document.getElementById('upload-zone').click();
      }.bind(this), false);
    }

    this.dropZone.on("success", function(file, response) {
      if(response['status'] === 200) {
        window.location.href = '/download-xml?filename='+response["filename"];
      } else {
        addErroMsg('Datoteke nisu u odgovarajucem formatu')
      }
      addStatusIcon(response['status'])
    });
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

  get fileToReplace() {
    this.data.fileToReplace = [];
    return this.data.fileToReplace;
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
    addRemoveLinks: true,
    autoProcessQueue: false,
    acceptedFiles: '.xml',
    previewsContainer: false,
    params: controller.fileToReplace,
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
                }, 1000*(index+1))
              });
            }
        });
    }
  });
}
