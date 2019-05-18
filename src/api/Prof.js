import axios from "axios";
import {URL} from "../plugins/api.config.js"
const BaseUrl = `${URL}:5000/prof`;
const config = { 
                 headers: {'Content-Type' : 'application/json'},
                 withCredentials: true
               }
               
export default {
    classCreate(className){
      return axios.post(`${BaseUrl}/classCreate`,{className: className}, config);
    },
    classDelete(classCode){
      return axios.delete(`${BaseUrl}/${classCode}/delete`, config);
    },
    surveyActive(survey){
      return axios.put(`${BaseUrl}/${survey.classCode}/survey/active`, {SID:survey.SID, active:survey.active}, config);
    },
};
