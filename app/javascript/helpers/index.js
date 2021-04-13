export function getMetaValue(name) {
  const element = findElement(document.head, `meta[name="${name}"]`);
  if (element) {
    return element.getAttribute("content");
  }
}

export function findElement(root, selector) {
  if (typeof root == "string") {
    selector = root;
    root = document;
  }
  return root.querySelector(selector);
}

export function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  } else if (Array.from) {
    return Array.from(value);
  } else {
    return [].slice.call(value);
  }
}

export function removeElement(el) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

export function insertAfter(el, referenceNode) {
  return referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

export function addFileToTheList(fileList, uuid) {
  var availableSlots = document.querySelectorAll(".file-slot:not(.filed-file-slot)");
  var emptySlotImg = availableSlots[0].querySelector('.empty-slot-img');
  emptySlotImg.src = '/assets/full-slot.png'
  availableSlots[0].className += ' filed-file-slot'
  availableSlots[0].setAttribute('data-uuid', uuid)
  availableSlots[0].className = availableSlots[0].className.replace(/first/g, "");
  availableSlots[1].className += ' first'
  createFileNameElement(availableSlots[0], fileList)
  var availableSlots = document.querySelectorAll(".file-slot:not(.filed-file-slot)");
}

export function addStatusIcon(responseCode) {
  var availableSlots = document.querySelectorAll(".filed-file-slot:not(.processed-file):not(.rejected-file)");
  var occupied_slot = availableSlots[0].querySelector('.empty-slot-img');
  if(responseCode === 200) {
    occupied_slot.src = '/assets/success-file.png';
    availableSlots[0].className += ' processed-file'
  } else {
    occupied_slot.src = '/assets/error.svg';
    availableSlots[0].className += ' rejected-file';
  }
}

export function getFilenameExtension(filename) {
  return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

export function returnToInitial(element) {
  element.classList.remove('filed-file-slot');
  element.querySelector('.empty-slot-img').src = '/assets/empty-slot.png'
  element.querySelector('.element-name').remove();
  element.removeAttribute('data-uuid');
  var availableSlots = document.querySelectorAll(".file-slot:not(.filed-file-slot)");
  for(let availableSlot of availableSlots) {
    availableSlot.className = availableSlot.className.replace(/first/g, "");
  }
  availableSlots[0].className += ' first'
}

export function disableSendBtnIfNoFile(uploadedFile, submitBtn) {
  if(uploadedFile.length === 0) {
    submitBtn.classList.remove('enabled-btn')
    submitBtn.disabled = false;
  }
}

export function addFileNotLoadedError(rejectedFiles) {
  var fullContainerErrorMsg = document.getElementById('error-container2');
  var errorMsg = rejectedFiles.join(', ').replace(/, ([^,]*)$/, ' i $1');
  var errorElement = fullContainerErrorMsg.querySelector('.error-msg')
  errorElement.innerHTML = errorMsg + ' nisu ucitani u ovaj sesiji'
  fullContainerErrorMsg.style.display = 'inline-flex'
}

export function replaceFile(indexOfFile) {
  var slotToReplace = document.querySelectorAll(".file-slot")[indexOfFile];
  var nameOfRejectedFile = slotToReplace.querySelector('.element-name');
  slotToReplace.className = ''
  slotToReplace.className += 'file-slot'
  nameOfRejectedFile.remove();
}

export function addErroMsg(msg) {
  var errorDiv = document.getElementById('error-container')
  errorDiv.style.display = 'inline-flex';
  var errorMsg = errorDiv.querySelector('.error-msg');
  errorMsg.innerHTML = msg
}

export function hideErrorMsg() {
  document.getElementById('error-container').style.display = 'none';
  document.getElementById('error-container2').style.display = 'none';;
}

export function sortList() {
  var parent = document.querySelectorAll('.slots-row');
  var files = document.querySelectorAll('.file-slot');
  var fileSlotArray = Array.prototype.slice.call(files, 0);
  fileSlotArray = fileSlotArray.sort(function(a,b) {
    var aUuid = a.dataset.uuid
    var bUuid = b.dataset.uuid
    if(typeof(aUuid) === 'undefined' && typeof(bUuid) !== 'undefined') return 1
    if(typeof(aUuid) !== 'undefined' && typeof(bUuid) === 'undefined') return -1
    return 0
  });
  var firstRow = fileSlotArray.slice(0, 5);
  var secondRow = fileSlotArray.slice(5, 10);
  parent[0].children.forEach(function(element, index) {
    parent[0].appendChild(firstRow[index])
  });
  parent[1].children.forEach(function(element, index) {
    parent[1].appendChild(secondRow[index])
  });
}

function createFileNameElement(availableSlot, fileList) {
  var fileDisplayEl = document.createElement('p');
  fileDisplayEl.innerHTML = fileList[fileList.length - 1];
  fileDisplayEl.className = 'element-name'
  availableSlot.appendChild(fileDisplayEl);
}