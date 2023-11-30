<script setup>
import { ref, computed, watchEffect } from "vue";
import { useMainStore } from "../store/main";
import { apiPostContact } from "../api/index";

const mainStore = useMainStore();
let faqData = computed(() => mainStore.faqData);
let serviceData = computed(() => mainStore.serviceData);
let service = computed(() => mainStore.service[mainStore.currentLanguage - 1]);
let title = computed(() => mainStore.navButtons[mainStore.currentLanguage - 1].FAQ);

const toggledAnswer = ref([]);
const checkAnswer = (index) => {
  toggledAnswer.value[index] = !toggledAnswer.value[index];
};
const form = ref({
  language_id: mainStore.currentLanguage,
  name: "",
  email: "",
  subject: "",
  contact_subject_id: null,
  brand: "",
  brand_model: "",
  country: "",
  place: "",
  message: "",
  contact_hear_id: "",
  image: null,
  link: "",
});

let fileUploaded = ref(false);
const changeFile = (event) => {
  const selectedFile = event.target.files[0];
  const fileMaxSize = 1024 * 1024 * 5;
  if (selectedFile.size < fileMaxSize) {
    form.value.image = selectedFile;
    fileUploaded.value = true;
    console.log(selectedFile);
  }
};

const transSubjectId = () => {
  if (
    form.value.subject === "General Infomation" ||
    form.value.subject === "一般資訊" ||
    form.value.subject === "一般资讯" ||
    form.value.subject === "一般のお問い合わせ"
  ) {
    form.value.contact_subject_id = 1;
  } else if (
    form.value.subject === "Compatibility" ||
    form.value.subject === "對應耳機型號問題" ||
    form.value.subject === "对应耳机型号问题" ||
    form.value.subject === "対応機種のお問い合わせ"
  ) {
    form.value.contact_subject_id = 2;
  } else {
    form.value.contact_subject_id = 3;
  }
};

let showAlert = ref(false);
let showFeedback = ref(false);
const submit = () => {
  console.log(form.value);
  transSubjectId();
  const formData = new FormData();
  formData.set("language_id", form.value.language_id);
  formData.set("name", form.value.name);
  formData.set("email", form.value.email);
  formData.set("contact_subject_id", form.value.contact_subject_id);
  formData.set("brand", form.value.brand);
  formData.set("brand_model", form.value.brand_model);
  formData.set("country", form.value.country);
  formData.set("place", form.value.place);
  formData.set("message", form.value.message);
  formData.set("contact_hear_id", form.value.contact_hear_id);
  formData.set("image", form.value.image);
  formData.set("link", form.value.link);
  showAlert.value = false;
  if (
    form.value.name === "" ||
    form.value.email === "" ||
    form.value.brand === "" ||
    form.value.brand_model === "" ||
    form.value.message === ""
  ) {
    showAlert.value = true;
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  } else {
    showFeedback.value = true;
    transSubjectId();
    apiPostContact(formData)
      .then((res) => {
        form.value.name = "";
        form.value.email = "";
        form.value.subject = "";
        form.value.contact_subject_id = null;
        form.value.brand = "";
        form.value.brand_model = "";
        form.value.country = "";
        form.value.place = "";
        form.value.message = "";
        form.value.contact_hear_id = "";
        form.value.image = null;
        form.value.link = "";
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      showFeedback.value = false;
    }, 3000);
  }
};
watchEffect(() => {
  form.value.language_id = mainStore.currentLanguage;
});
</script>
<template>
  <div class="container">
    <section class="section-1">
      <div class="title">{{ title }}</div>
      <div class="subtitle">
        {{ serviceData.faq.section_1[0].sub_title }}
      </div>
      <div class="section-box">
        <div class="question" v-for="(item, index) in faqData" :key="item">
          <div class="top" :class="toggledAnswer[index] ? 'show' : ''" @click="checkAnswer(index)">
            <p class="subtitle bold_text" v-html="item.question"></p>
            <div class="close">
              <img src="../assets/images/qa_close.png" alt="" />
            </div>
          </div>
          <template v-if="mainStore.isMobile">
            <div class="answer" v-show="toggledAnswer[index]" v-html="item.answer_m"></div>
          </template>
          <template v-else>
            <div class="answer" v-show="toggledAnswer[index]" v-html="item.answer"></div>
          </template>
        </div>
      </div>
    </section>
    <section class="section-2">
      <div class="section-box">
        <div class="title">SERVICE</div>
        <div class="form">
          <form>
            <div class="item alert">
              <input v-model="form.name" id="input" type="text" :placeholder="service.name" />
              <label class="check" for="input">
                <img src="../assets/images/qa_check.png" alt=""
              /></label>
            </div>
            <div class="item alert">
              <input v-model="form.email" id="input" type="email" :placeholder="service.mail" />
              <label class="check" for="input">
                <img src="../assets/images/qa_check.png" alt="" />
              </label>
            </div>
            <div class="select">
              <select v-model="form.subject">
                <option disabled selected value="">{{ service.subject }}</option>
                <option v-for="(item, index) in service.subjectOptions" :key="item">
                  {{ item }}
                </option>
              </select>
              <div class="close">
                <img src="../assets/images/qa_close.png" alt="" />
              </div>
            </div>
            <div class="item alert">
              <input v-model="form.brand" id="input" type="text" :placeholder="service.brand" />
              <label class="check" for="input">
                <img src="../assets/images/qa_check.png" alt=""
              /></label>
            </div>
            <div class="item alert">
              <input
                v-model="form.brand_model"
                id="input"
                type="text"
                :placeholder="service.brand_model"
              />
              <label class="check" for="input">
                <img src="../assets/images/qa_check.png" alt=""
              /></label>
            </div>
            <div class="item long">
              <input v-model="form.country" id="input" type="text" :placeholder="service.country" />
              <label class="check" for="input">
                <img src="../assets/images/qa_check.png" alt=""
              /></label>
            </div>
            <div class="item long">
              <input v-model="form.place" id="input" type="text" :placeholder="service.wherebuy" />
              <label class="check" for="input">
                <img src="../assets/images/qa_check.png" alt=""
              /></label>
            </div>

            <div class="message">
              <label for="message alert">{{ service.message }}</label>
              <textarea v-model="form.message" maxlength="1000"></textarea>
              <div class="textAlert subtitle">{{ service.messageAlert }}</div>
            </div>
            <div class="radio">
              <label>{{ service.whereknow }}</label>
              <div class="radio-box">
                <div class="box" v-for="(item, index) in serviceData.hear" :key="item">
                  <input
                    type="radio"
                    :value="item.contact_hear_id"
                    :id="item.name"
                    v-model="form.contact_hear_id"
                  />
                  <label :for="item.name" class="option">{{ item.name }}</label>
                </div>
              </div>
            </div>
            <div class="item image">
              <label for="file" class="file">
                <input
                  id="file"
                  type="file"
                  @change="changeFile"
                  accept=".jpg, .jpeg, .png, .gif"
                />
                <span class="button">{{ service.upload }}</span>
              </label>
              <label
                class="check"
                for="input"
                :style="{
                  width: fileUploaded ? '13%' : '4%',
                }"
              >
                <img v-if="fileUploaded" src="../assets/images/faq_success.png" alt="" />
                <img v-else src="../assets/images/qa_check.png" alt="" />
              </label>
              <div class="textAlert subtitle">{{ service.imgAlert }}</div>
            </div>
            <div class="item last">
              <input v-model="form.link" id="input" type="text" :placeholder="service.reference" />
              <label class="check" for="input">
                <img src="../assets/images/qa_check.png" alt=""
              /></label>
            </div>
            <div class="submit_button" @click.prevent="submit">
              {{ service.submit }}
              <div class="alertText" v-if="showFeedback">{{ service.success }}</div>
              <div class="alertText" v-if="showAlert">{{ service.fail }}</div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
<style lang="scss" scoped>
.container {
  background-color: var(--background-color-1);
  .section-1 {
    margin-left: 25%;
    padding-top: 8%;
    width: calc(55% - 2px);
    background-color: var(--background-color-2);
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    .title {
      margin-left: 5%;
    }
    .subtitle {
      margin-top: 3%;
      margin-left: 5%;
      padding-right: 15%;
    }
    .section-box {
      margin-top: 5%;
      display: flex;
      flex-direction: column;
      .question {
        border-top: 1px solid var(--border-color);
        .top {
          padding: 2% 5%;
          background-color: var(--background-color-2);
          min-height: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          :deep(p) {
            width: 95%;
            margin: 0%;
            padding-right: 0%;
          }
          .close {
            width: 2.5%;
            display: flex;
            align-items: center;
            transition: transform 0.3s ease-in-out;
          }
        }
        .show {
          background-color: #d3b889;
          p {
            color: var(--text-color-2);
          }
          .close {
            img {
              transform: rotate(180deg);
              filter: invert(1) grayscale(100%) brightness(200%);
            }
          }
        }
      }
      .answer {
        padding: 2% 20% 2% 5%;
        border-top: 1px solid var(--border-color);
        :deep(em) {
          font-style: italic;
        }
        :deep(strong) {
          font-weight: bold;
        }
        :deep(p) {
          margin-top: 1%;
          font-weight: 300;
          line-height: 1.2;
          font-size: 1.05vw;
          letter-spacing: 1.1px;
          color: var(--text-color-1);
        }

        :deep(ol) {
          margin-bottom: 0.5%;
          margin-left: 3%;
          font-weight: 300;
          line-height: 1.2;
          font-size: 1.05vw;
          letter-spacing: 1.1px;
          color: var(--text-color-1);
        }
        :deep(ul) {
          margin-bottom: 0.5%;
          margin-left: 3%;
          font-weight: 300;
          line-height: 1.2;
          font-size: 1.05vw;
          letter-spacing: 1.1px;
          color: var(--text-color-1);
        }
      }
    }
  }
  .section-2 {
    background-color: var(--background-color-2);
    border-top: 1px solid var(--border-color);
    .section-box {
      margin-left: 25%;
      padding-top: 4%;
      width: calc(55% - 1px);
      border-left: 1px solid var(--border-color);
      .title {
        margin-left: 5%;
      }

      .form {
        margin-left: 5%;
        form {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          .select {
            margin-top: 5%;
            margin-right: 6%;
            display: flex;
            width: 45%;
            border-bottom: 1.5px solid rgb(0, 0, 0, 0.4);
            overflow: hidden;
            position: relative;
            select {
              /* Reset Select */
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
              outline: 0;
              border: 0;
              box-shadow: none;
              /* Personalize */
              flex: 1;
              // font-family: "NotoSansCJKtc";
              font-weight: bold;
              font-size: 1.05vw;
              letter-spacing: 1.1px;
              color: var(--text-color-1);
              cursor: pointer;
            }
            .close {
              position: absolute;
              top: 50%;
              right: 0;
              transform: translateY(-50%);
              width: 5%;
            }
          }
          .message {
            margin-top: 5%;
            margin-right: 5%;
            width: 100%;
            display: flex;
            flex-direction: column;
            label {
              font-weight: bold;
              font-size: 1.05vw;
              letter-spacing: 1.1px;
              color: var(--text-color-1);
              position: relative;
              &:before {
                content: "*";
                position: absolute;
                top: 50%;
                left: -2%;
                transform: translateY(-50%);
                font-weight: bold;
                font-size: 1.05vw;
                letter-spacing: 1.1px;
                color: var(--text-color-3);
              }
            }
            textarea {
              margin-top: 1%;
              min-height: 100px;
            }
            .textAlert {
              margin-top: 1%;
              font-size: 0.6vw;
            }
          }
          .radio {
            margin-top: 5%;
            margin-right: 5%;
            width: 100%;
            display: flex;
            flex-direction: column;
            label {
              // font-family: "NotoSansCJKtc";
              font-weight: bold;
              font-size: 1.05vw;
              letter-spacing: 1.1px;
              color: var(--text-color-1);
            }
            .radio-box {
              margin-top: 1%;
              display: flex;
              align-items: center;
              .box {
                margin-right: 2%;
                display: flex;
                input[type="radio"] {
                  width: 20px; /* 设置宽度 */
                  height: 20px; /* 设置高度 */
                }
                .option {
                  width: 100%;
                  // font-family: "NotoSansCJKtc-Thin";
                  font-weight: 300;
                  font-size: 1.05vw;
                  letter-spacing: 1.1px;
                  color: var(--text-color-1);
                  display: flex;
                  align-items: center;
                }
              }
            }
          }
          .item {
            margin-right: 5%;
            margin-top: 5%;
            width: 45%;
            border-bottom: 1.5px solid rgb(0, 0, 0, 0.4);
            display: flex;
            position: relative;
            input {
              padding-right: 7%;
              outline: none;
              border-radius: 0;
              border: 0;
              // font-family: "NotoSansCJKtc";
              font-weight: bold;
              font-size: 1.05vw;
              letter-spacing: 1.1px;
              color: var(--text-color-1);
              width: 100%;
            }
            .file {
              outline: none;
              border-radius: 0;
              border: 0;
              // font-family: "NotoSansCJKtc";
              font-weight: bold;
              font-size: 1.05vw;
              letter-spacing: 1.1px;
              color: var(--text-color-1);
              width: 100%;
              position: relative;
              z-index: 0;
              #file {
                opacity: 0;
              }
              .button {
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                // font-family: "NotoSansCJKtc";
                font-weight: bold;
                font-size: 1.05vw;
                letter-spacing: 1.1px;
                color: var(--text-color-1);
                width: 100%;
              }
            }
            .check {
              pointer-events: none;
              position: absolute;
              top: 50%;
              right: 0;
              transform: translateY(-50%);
              width: 4%;
              transition: all 0.3s ease;
              display: flex;
            }
            .textAlert {
              position: absolute;
              bottom: -70%;
              left: 0;
              font-size: 0.6vw;
              height: 0.1rem;
            }
          }
          .long {
            width: 100%;
            .check {
              width: 2%;
            }
          }
          .alert {
            &:before {
              content: "*";
              position: absolute;
              top: 50%;
              left: -4%;
              transform: translateY(-50%);
              // font-family: "NotoSansCJKtc";
              font-weight: bold;
              font-size: 1.05vw;
              letter-spacing: 1.1px;
              color: var(--text-color-3);
            }
          }
          .submit_button {
            margin: 8% auto 8%;
            padding: 1%;
            width: 12%;
            transition: transform 0.3s ease;
            position: relative;
            &:hover {
              transform: scale(1.1);
            }
            .alertText {
              position: absolute;
              bottom: -100%;
              left: 50%;
              transform: translateX(-50%);
              width: 500px;
              // font-family: "NotoSansCJKtc";
              font-weight: bold;
              text-align: center;
              font-size: 1.05vw;
              letter-spacing: 1.1px;
              color: var(--text-color-3);
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .container {
    .section-1 {
      margin-left: 15%;
      padding-top: 8%;
      width: calc(85%);
      .subtitle {
        padding-right: 22%;
      }
      .section-box {
        margin-top: 5%;
        display: flex;
        flex-direction: column;
        .question {
          border-top: 1px solid var(--border-color);
          .top {
            p {
              width: 88%;
            }
            :deep() .bold {
              width: 80%;
            }
            .close {
              width: 5%;
            }
          }
          .show {
            background-color: #d3b889;
          }
        }
        .answer {
          :deep(p) {
            font-size: 2.8vw;
            letter-spacing: 1px;
            strong {
              font-size: 2.8vw;
              letter-spacing: 1.1px;
            }
          }
          :deep(ol) {
            margin-bottom: 2%;
            margin-left: 6%;
            font-size: 2.8vw;
            letter-spacing: 1.1px;
            strong {
              font-size: 2.8vw;
              letter-spacing: 1.1px;
            }
          }
          :deep(ul) {
            margin-bottom: 2%;
            margin-left: 6%;
            font-size: 2.8vw;
            letter-spacing: 1.1px;
            strong {
              font-size: 2.8vw;
              letter-spacing: 1.1px;
            }
          }
        }
      }
    }
    .section-2 {
      .section-box {
        margin-left: 15%;
        width: calc(85%);
        .form {
          margin-left: 5%;
          form {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .select {
              margin-right: 0%;
              width: 90%;
              select {
                font-size: 2.8vw;
                letter-spacing: 0.7px;
              }
              &:after {
                font-size: 2.8vw;
                letter-spacing: 0.7px;
              }
              .close {
                width: 4%;
              }
            }
            .message {
              margin-right: 0%;
              width: 90%;
              label {
                font-size: 2.8vw;
                letter-spacing: 0.7px;
                &:before {
                  font-size: 2.8vw;
                  letter-spacing: 0.7px;
                  left: -4%;
                }
              }

              .textAlert {
                font-size: 2vw;
              }
            }
            .radio {
              margin-top: 5%;
              margin-right: 5%;
              width: 100%;
              display: flex;
              flex-direction: column;
              label {
                font-size: 2.8vw;
                letter-spacing: 0.7px;
              }
              .radio-box {
                flex-wrap: wrap;
                .box {
                  margin-top: 1%;
                  width: 28%;
                  .option {
                    vertical-align: middle;
                    font-size: 3vw;
                    letter-spacing: 0.7px;
                  }
                }
              }
            }
            .item {
              margin-right: 0%;
              width: 90%;
              input {
                font-size: 2.8vw;
                letter-spacing: 0.7px;
              }
              .check {
                width: 3.5%;
              }
              .file {
                font-size: 2.8vw;
                letter-spacing: 0.7px;
                .button {
                  padding-left: 0.3%;
                  font-size: 2.8vw;
                  letter-spacing: 0.7px;
                }
              }
              .textAlert {
                font-size: 2vw;
              }
            }
            .long {
              width: 90%;
              .check {
                width: 3.5%;
              }
            }
            .last {
              margin-top: 15%;
            }
            .alert {
              &:before {
                font-size: 2.8vw;
                letter-spacing: 0.7px;
              }
            }
            .submit_button {
              margin-left: 30%;
              margin-bottom: 10%;
              width: 30%;
              font-size: 3vw;
              letter-spacing: 0.7px;
              height: auto;
              .alertText {
                width: 500px;
                font-size: 2.8vw;
                letter-spacing: 0.7px;
              }
            }
          }
        }
      }
    }
  }
}
@media (max-width: 600px) {
  .container {
    .section-2 {
      .section-box {
        .form {
          form {
            .submit_button {
              .alertText {
                width: 400px;
              }
            }
          }
        }
      }
    }
  }
}
@media (max-width: 475px) {
  .container {
    .section-2 {
      .section-box {
        .form {
          form {
            .last {
              margin-top: 17%;
            }
            .submit_button {
              .alertText {
                width: 330px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
