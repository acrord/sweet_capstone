<template>
  <v-stepper-content :step="n+1">
    <v-card class="mb-5" color="grey lighten-3">
      <v-btn absolute dark fab top right class="crimson" @click="deleteStep">
        <v-icon>remove</v-icon>
      </v-btn>
      
      <v-container>
        <v-layout>
          <v-radio-group v-model="type" :mandatory="false" class="quizType" row>
            <v-radio label="객관식" value="1" color="cyan ligten-1" select/>
            <v-radio label="객관식(복수 응답 가능)" value="2" color="cyan ligten-1"/>
            <v-radio label="주관식(단답형)" value="3" color="cyan ligten-1"/>
          </v-radio-group>

          <v-flex md3 style="padding:2px">
            <v-text-field :id="`point${n}`" v-model="score" color="cyan ligten-1" label="배점" type="number"/>
          </v-flex>
        </v-layout>
        <v-divider/>
        <v-btn @click.native="selectFiles()" id="imageUpload">
          Upload a image
          <v-icon right aria-hidden="true">add_a_photo</v-icon>
        </v-btn>
        <v-layout style="align-items:center">
          <div
            :class="`quizQuestion_${n+1}`"
            contenteditable="true"
            placeholder="퀴즈문제를 작성하세요."
            style="font-size: 1.5rem; background:beige; width:750px; "
            v-html="quizQuestion"
          >
          </div>
          <div class="page">
            <input
              :id="`files${n}`"
              type="file"
              name="file"
              accept="image/*"
              :multiple="false"
              @change="uploadFiles($event, n)"
            >
            <v-progress-circular
              v-if="uploading && !uploadEnd"
              :size="100"
              :width="15"
              :rotate="360"
              :value="progressUpload"
              color="primary"
            >{{ progressUpload }}%</v-progress-circular>
          </div>
        </v-layout>
        <v-radio-group v-model="radioGroup" >
          <div v-if="type === '1'">
              <div v-for="(type1, index) in samplestype1" :key="type1.id">
                <v-layout class="type">
                  <v-radio 
                    :value="`${index}`" 
                    color="cyan ligten-1" 
                    :id="`correct${n}`"
                  />
                  <v-text-field
                    :class="'type1_'+`${n+1}`"
                    label="보기를 입력하세요"
                    v-model="content[index]"
                    single-line
                    color="rgb(111, 111, 111)"
                  />
                  <v-spacer/>
                  <v-icon @click="deleteType1(index)">mdi-close</v-icon>
                </v-layout>
              </div>
            <v-layout v-if="type === '1'">
              <v-icon @click="addType1()">mdi-plus</v-icon>
              <v-input @click="addType1()" label="보기 추가" class="addSample"/>
            </v-layout>
          </div>

          <div v-if="type === '2'">
            <div v-for="(type2, index) in samplestype2" :key="type2.id">
              <v-layout class="type">
                  <!-- prepend-icon="mdi-checkbox-blank-outline" -->
                <v-checkbox 
                  :value="`${index}`" 
                  color="cyan ligten-1" 
                  hide-details class="shrink mr-2"
                  v-model="correct"
                  :id="`correct${n}`"
                />
                <v-text-field
                  :class="'type2_'+`${n+1}`" 
                  label="보기를 입력하세요"
                  v-model="content[index]"
                  single-line
                  color="rgb(111, 111, 111)"
                />
                <v-spacer/>
                <v-icon @click="deleteType2(index)">mdi-close</v-icon>
              </v-layout>
            </div>
            <v-layout v-if="type=== '2'">
              <v-icon @click="addType2()">mdi-plus</v-icon>
              <v-input label="보기 추가" class="addSample" @click="addType2()"/>
            </v-layout>
          </div>
        </v-radio-group>
        <v-layout v-if="type === '3'">
          <v-textarea solo flat outline 
          color="cyan lighten-1"
          :value="type3"
          />
        </v-layout>
      </v-container>
    </v-card>

    <v-layout justify-space-between>
      <v-btn 
      v-if="n+1 != 1"
      class="cyan lighten-1 white--text" 
      @click="preStep">Pre</v-btn>
      <v-btn 
      v-else
      class="red lighten-1 white--text" 
      @click="cancel">cancel</v-btn>
      <v-btn
        v-if="n+1 !== steps"
        :key="n"
        class="cyan lighten-1 white--text"
        id="next"
        @click="nextStep(n)"
      >Next</v-btn>
      <v-btn
        v-if="n+1 === steps"
        :key="n"
        class="cyan lighten-1 white--text"
        @click="edit"
      >edit</v-btn>
    </v-layout>
  </v-stepper-content>
</template>
<script>
import { imageStorage } from "@/utils/imageStorage";

export default {
  created() {
    if(this.quiz!=undefined){
      this.score = this.quiz.point
      this.type = `${this.quiz.quizType}`
      this.samplestype1 = this.card_data.samplestype1;
      this.samplestype2 = this.card_data.samplestype2;
      this.newID1 = this.card_data.samplestype1.length+1
      this.newID2 = this.card_data.samplestype2.length+1001
      this.quizQuestion = this.quiz.quizQuestion;
      let elem = document.querySelector(`.quiz${this.QID}`).querySelector(`div[step='${this.n+1}']`)
      if(this.type == "1"){
        this.content = this.quiz.content
        this.radioGroup = `${parseInt(this.quiz.correct.split(" ")[0]) - 1}`;
      } else if(this.type== "2"){
        this.correct = this.quiz.correct.split("")
        for(let i=0;i<this.correct.length;i++){
          this.correct[i] = String(parseInt(this.correct[i])-1)
        }
        this.content = this.quiz.content
      } else{
        this.type3 = this.quiz.correct;
      }
    }
  },
  data() {
    return {
      radioGroup: 1,
      progressUpload: 0,
      fileName: "",
      uploadTask: "",
      uploading: false,
      uploadEnd: false,
      content:[],
      downloadURL: "",
      quizQuestion:"",
      correct:[],
      score:"",
      type: "1",
      type3:"",
      samplestype1: [{id:1}],
      samplestype2: [{id:1001}],
      newID1: 2,
      newID2: 1002,
    };
  },
  props: {
    card_data: Object,
    n: Number,
    steps: Number,
    quiz: Object,
    QID:Number
  },
  methods: {
    getData() {
      return this.steps;
    },
    addType1() {
      this.samplestype1.push({
        id: this.newID1++
      });
    },
    addType2() {
      this.samplestype2.push({
        id: this.newID2++
      });
    },
    deleteType1(index) {
      this.samplestype1.splice(index, 1);
    },
    deleteType2(index) {
      this.samplestype2.splice(index, 1);
    },
    preStep() {
      this.$emit("preStep");
    },
    nextStep() {
      this.$emit("nextStep");
    },
    edit() {
      this.$emit("edit");
    },
    deleteStep() {
      this.$emit("remove");
    },
    selectFiles() {
      document.querySelector(`#files${this.n}`).click();
    },
    uploadFiles(e) {
      let files = e.target.files || e.dataTransfer.files;
      Array.from(Array(files.length).keys()).map(x => {
        this.upload(files[x]);
      });
    },
    upload(file) {
      this.fileName = file.name;
      this.uploading = true;
      this.uploadTask = imageStorage.child(`${this.fileName}`).put(file);
    },
    changeSize(url) {
      return new Promise(function(resolve, reject) {
        var img = new Image();
        var width, height;
        img.addEventListener("load", function() {
          if(this.naturalWidth > this.naturalHeight) {
            width = 100;
            height = this.naturalHeight * (100 / this.naturalWidth);
          }
          else {
            width = this.naturalWidth * (100 / this.naturalHeight);
            height = 100;
          }
          resolve([width, height]);
        });
        img.src = url;
      });
    },
    cancel(){
      if(confirm("취소하시겠습니까?")) this.$EventBus.$emit("edit", true);
    },
  },
  watch: {
    uploadTask: function() {
      this.uploadTask.on(
        "state_changed",
        sp => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100
          );
        },
        null,
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.uploadEnd = true;
            var idx = this.n + 1;
            this.downloadURL = downloadURL;
            this.changeSize(downloadURL).then(function(size) {
              let imgHtml = document.createElement("img");
              imgHtml.src = downloadURL;
              imgHtml.style.width = `${size[0]}%`;
              imgHtml.style.height = `${size[1]}%`;
              document
                .querySelector(`.quizQuestion_${idx}`)
                .appendChild(imgHtml);
            });
          });
        }
      );
    }
  }
};
</script>

<style>
.progress-bar {
  margin: 10px 0;
}
input[type="file"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
.crimson.v-btn--floating{
  z-index: 0;
}
div.layout.type div.v-radio.theme--light{
  margin-right: 0px !important;
}
div.layout.type div.v-radio.theme--light div.v-input--selection-controls__input{
  margin-right: 4px !important;
}

div.layout.type div.v-input.v-text-field.v-text-field--single-line.theme--light div.v-input__control div.v-text-field__details{
  height: 0px;
  min-height: 0px;
}
div.v-input.v-input--selection-controls.v-input--radio-group > div.v-input__control > div.v-messages.theme--light{
  height: 0px;
  min-height: 0px;
}
div.layout.type div.v-input.v-text-field.v-text-field--single-line div.v-input__control div.v-text-field__details{
  height: 0px;
  min-height: 0px;

}
.type > div.v-input.shrink.mr-2.v-input--checkbox.v-input--hide-details.theme--light > .v-input__control{
  margin-top: 10px;
}
.v-input.shrink.mr-2.v-input--selection-controls.v-input--checkbox.v-input--hide-details.theme--light{
  margin-right: 1px !important;
}

[contenteditable=true]:empty:before{
  content: attr(placeholder);
  display: block; /* For Firefox */
}
div[contenteditable=true] {
  border: 1px solid #ddd;
  color : #333;
  font-size: 12px;
  width: 300px;
  padding: 5px;
  min-height:200px;
  margin-bottom: 20px;
}
</style>