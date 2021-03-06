 /*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************/
import {FileHashCalculator} from '../../utils/sha256File';
import { resolve } from '_uri-js@4.2.2@uri-js';

const ADD_FILES = 'ADD_FILES';
const state = {fileQueue:{},key:''}
const actions= {
  async addFiles({commit}, {files,key}) {
    let newFiles =null;
    let j=0
   
    for(let key of files){ 
      newFiles =new FileHashCalculator(key)
      j++
      console.log(newFiles,j)
      
     }
    
    console.log(newFiles)
    commit(ADD_FILES, {data:newFiles,key});
    resolve({data:newFiles,key})
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
