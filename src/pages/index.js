import "./index.css";
import avatar from "../images/avatar.jpg";
import logo from "../images/logo.svg";
import pencil from "../images/pencil.svg.svg";
import addButton from "../images/add-btn.svg";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import unionIcon from "../images/Union.svg";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helper.js";

const avatarImage = document.getElementById("avatar");
avatarImage.src = avatar;
const logoImage = document.getElementById("logo");
logoImage.src = logo;
const pencilIcon = document.getElementById("pencilIcon");
pencilIcon.src = pencil;
const addBtnIcon = document.getElementById("addBtnIcon");
addBtnIcon.src = addButton;
const image = document.createElement("img");
image.src = unionIcon;
document.body.appendChild(image);

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");


const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarDeletetBtn = document.querySelector(".modal__submit-btn_delete");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalcloseBtn = previewModal.querySelector(
  ".modal__close-btn_preview"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const modals = [editModal, cardModal, previewModal];

// const initialCards = [
//   {
//     name: "Golden Gate bridge",
//     link: "  https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace  ",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];


const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
      authorization: "cf121c58-428e-431e-bc88-d7d5cfc3881a",
      "Content-Type": "application/json",
  },
});

api.getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    document.addEventListener("DOMContentLoaded", () => {
      const avatarImage = document.querySelector(".avatar");
    
      if (avatarImage) {
        avatarImage.src = avatar; 
      }
    })
  })
  .catch(console.error);

function handleLike(evt, id, cardLikedBtn){
  const isLiked = cardLikedBtn.classList.contains('card__like-button_liked');
  
  api. handleLikeStatus(id, isLiked) 
  .then(() => {
    cardLikedBtn.classList.toggle("card__like-button_liked");
  })
  .catch(console.error);
}

previewModalcloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

let selectedCard, selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikedBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  
  if (data.isLiked) { 
    cardLikedBtn.classList.add("card__like-button_liked");
  }

  cardLikedBtn.addEventListener("click", (evt) => 
    handleLike(evt, data._id, cardLikedBtn));

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
  });

  cardDeleteBtn.addEventListener("click", () => 
    handleDeleteCard(cardElement, data._id, cardDeleteBtn));

  return cardElement;
}

function handleDeleteCard(cardElement, cardId, cardDeleteBtn) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
  
  setButtonText(cardDeleteBtn, true, "Delete", "Deleting...");
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  setButtonText(avatarDeletetBtn, true, "Delete", "Deleting...");

  api.deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarDeletetBtn, false, "Delete", "Deleting...");
    });
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Save", "Saving...");

  const updatedUserInfo = { name: editModalNameInput.value };

  api.editUserInfo(updatedUserInfo)
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      editFormElement.reset();
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Save", "Saving...");
    });
}

function toggleSubmitButton() {
  if (cardNameInput.value.trim() !== "" && cardLinkInput.value.trim() !== "") {
    cardSubmitBtn.disabled = false;
    cardSubmitBtn.classList.remove("modal__submit-btn_disabled");
  } else {
    cardSubmitBtn.disabled = true;
    cardSubmitBtn.classList.add("modal__submit-btn_disabled");
  }
}
cardNameInput.addEventListener("input", toggleSubmitButton);
cardLinkInput.addEventListener("input", toggleSubmitButton);

function handleAddCardSumbmit(evt) {
  evt.preventDefault();
  cardSubmitBtn.disabled = true;
  setButtonText(cardSubmitBtn, true, "Save", "Saving...");

  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };

  api.createCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      cardForm.reset();
      toggleSubmitButton();
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(cardSubmitBtn, false, "Save", "Saving...");
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  setButtonText(avatarSubmitBtn, true, "Save", "Saving...");

  api.editAvatarInfo(avatarInput.value)
    .then((data) => {
      avatarImage.src = data.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarSubmitBtn, false, "Save", "Saving...");
    });
}

function closeOnOverlayClick(modal) {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
}
modals.forEach((modal) => {
  closeOnOverlayClick(modal);
});

function handleEscape(evt) {
  if (evt.key === "Escape") {
    modals.forEach(closeModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  resetValidation(
    editModal,
    [editModalNameInput],
    settings
  );
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  cardForm.reset();
  cardSubmitBtn.disabled = true; 
  cardSubmitBtn.classList.add("modal__submit-btn_disabled"); 
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSumbmit);

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

document.querySelectorAll(".modal__close-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const modal = event.target.closest(".modal");
    closeModal(modal);
  });
});

document.querySelectorAll(".modal__submit-btn_cancel").forEach((button) => {
  button.addEventListener("click", (event) => {
    const modal = event.target.closest(".modal");
    closeModal(modal);
  });
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal_opened").forEach((modal) => {
      closeModal(modal);
    });
  }
});

enableValidation(settings);
