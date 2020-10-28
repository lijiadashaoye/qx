 /*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************/
import {FileHashCalculator} from '../../utils/broadcast';
import moment from'moment'
// console.log(FileHashCalculator,FileHashCalculator.prototype);


const ADD_FILES = 'ADD_FILES';
const state = {fileQueue:{},key:''}
const actions= {
  async addFiles({commit}, {files,key}) {
   
    let newFiles =null;
    let j=0
    let timeNow =moment().format('X')
    console.log(moment().format('X'))
    for(let key of files){ 
      newFiles =new FileHashCalculator(key)
      
      
      newFiles.on('all',function(type,key){
        console.log(type,key,'-----');
        console.log(moment().format('X')-timeNow)
      },this)
     
      j++
      // console.log(newFiles,j)
      
     }
     
    
    commit(ADD_FILES, {data:newFiles,key});
  }
}
const mutations={ [ADD_FILES]: (state,{ data,key}) => {
  state.key=''
  state.fileQueue=data
  state.key=key
}}
export default {
  namespaced: true,
  state,
  mutations,
  actions
  
  
};
