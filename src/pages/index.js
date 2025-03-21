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
      cardsList.prepend(cardElement);
    });
    if (userInfo && userInfo.name && userInfo.about) {
      const avatarImage = document.querySelector(".avatar");
      avatarImage.src = userInfo.avatar; 

      const userName = document.querySelector(".profile__name");
      userName.textContent = userInfo.name;

      const userTitle = document.querySelector(".profile__description");
      userTitle.textContent = userInfo.about; 

      console.log(`User Name: ${userInfo.name}, Title: ${userInfo.about}`);
    } else {
      console.error("User information is missing necessary properties.");
    }
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");


const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
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

  cardLikedBtn.addEventListener("click", () => {
    cardLikedBtn.classList.toggle("card__like-button_liked");
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
  });

  cardDeleteBtn.addEventListener("click", (evt) => 
    handleDeleteCard(cardElement, data._id));

  return cardElement;
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
  .deleteCard(selectedCardId)
  .then(() => {
    selectedCard.remove();
    closeModal(deleteModal);
  })
  .catch(console.error);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const updatedUserInfo = {
    name: editModalNameInput.value,
    about: editModalDescriptionInput.value,
  };

  api
    .editUserInfo(updatedUserInfo) 
    .then((data) => {
      profileName.textContent = data.name; 
      profileDescription.textContent = data.about; 

      closeModal(editModal);
    })
    .catch(console.error); 
}

function handleAddCardSumbmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardEl = getCardElement(inputValues);
  cardsList.prepend(cardEl);
  cardForm.reset();
  disabledButton(cardSubmitBtn, settings);
  closeModal(cardModal);
}

function handleAvatarSubmit(evt){
  evt.preventDefault();
  console.log(avatarInput.value);
  api
  .editAvatarInfo(avatarInput.value)
  .then((data) =>{
    console.log(data.avatar)
    const avatarImage = document.querySelector(".profile__avatar");
      avatarImage.src = data.avatar; 

      closeModal(avatarModal);
  })
  .catch(console.err);
};


profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editModal,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
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

const modals = [editModal, cardModal, previewModal];

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

enableValidation(settings);
