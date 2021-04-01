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

export function addFileToTheList(fileList) {
  var availableSlots = document.querySelectorAll(".file-slot:not(.filed-file-slot)");
  var emptySlotImg = availableSlots[0].querySelector('.empty-slot-img');
  emptySlotImg.src = '/assets/full-slot.png'
  availableSlots[0].className += ' filed-file-slot'
  createFileNameElement(availableSlots[0], fileList)
}

export function addStatusIcon(responseCode) {
  var availableSlots = document.querySelectorAll(".filed-file-slot:not(.processed-file)");
  var occupied_slot = availableSlots[0].querySelector('.empty-slot-img');
  if(responseCode === 200) {
    occupied_slot.src = '/assets/success-file.png';
    availableSlots[0].className += ' processed-file'
  } else {
    occupied_slot.src = '/assets/rejected-file.png';
    availableSlots[0].className += ' rejected-file';
  }
}

export function addWrongFormatError() {
  var wrongFormatErrorElement =  document.getElementById('wrong-format-elem');
  var errorDiv = document.getElementById('error-div')
  if (typeof(wrongFormatErrorElement) === 'undefined' && wrongFormatErrorElement === null) {
    var wrongFormatErrorMsg = document.createElement('p');
    wrongFormatErrorMsg.innerHTML = 'Krivi format';
    wrongFormatErrorMsg.id = 'wrong-format-elem'
    errorDiv.appendChild(wrongFormatErrorMsg);
  }
}

export function getFilenameExtension(filename) {
  return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

function createFileNameElement(availableSlot, fileList) {
  var fileDisplayEl = document.createElement('p');
  fileDisplayEl.innerHTML = fileList[fileList.length - 1];
  availableSlot.appendChild(fileDisplayEl);
}