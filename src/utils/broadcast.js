 /*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************/
import CryptoJS from 'crypto-js';
import greenlet from 'greenlet';
import {Mediator} from './mediator'

// console.log(new Mediator().installTo);

const READER_CHUNK_SIZE = 1024 * 1024*250; // 1 MB

function _readFileChunk(file, offset, size) {
  // console.count('%c Call function a','color:green');
  return new Promise(resolve => {
    const reader = new FileReader();
    const data = file.slice(offset, size + offset);
    reader.onload = e => resolve(e.target.result);
    reader.readAsArrayBuffer(data);
  });
}
// Moved file reading into worker to reduce main thread usage
const readFileChunk =_readFileChunk// window.Worker ? greenlet(_readFileChunk) : _readFileChunk;





export class FileHashCalculator extends Mediator{//
  files=[];
  file = null;
  hash = [];
  completed = false;
  progress = 0;
  timeSpent = 0;
  state=null
  cumulation=0
  startTime=new Date().getTime()
  constructor(files) {
    super()
    this.files = files;
    this.file=null
    this.state='free';//'encrypting','success','end'
    this.start=1 //从第几个加密
    this.init()
    this.encryptingFile();
    
    
  }
  init(){
    new Mediator().installTo(this)
      // console.log(this.startTime)
  }
  encryptingFile(){
   
   
    while( (this.state=='free' || this.state=='encrypting') && this.start<=this.files.length){//10个文件加密一次加密完成以后再次开始加密
      this.state='encrypting'
      // window.Worker ? 
      //   greenlet( this.calculateHash(this.start,this.files[this.start-1])) 
      //   : 
      //   this.calculateHash(this.start,this.files[this.start-1])
      this.calculateHash(this.start,this.files[this.start-1])
      if(this.start%5==0){
        this.state='success'
        
      }else{
        this.start++
      }
      
    }
  }
  async calculateHash(index,file) {
    
    
    const startTime = Date.now();
    let sha256 = CryptoJS.algo.SHA256.create();
    if(!file || !file.size){
     
    }
    const fileSize = file.size;
    for (let i = 0; i < fileSize; i += READER_CHUNK_SIZE) {
      const chunk = await readFileChunk(file, i, READER_CHUNK_SIZE);
  
      const wordArray = CryptoJS.lib.WordArray.create(chunk);
      sha256.update(wordArray);
      this.progress = 100 * (i + 1) / fileSize;
      this.timeSpent = (Date.now() - startTime) / 1000;
    }

    this.hash.push({hash:sha256.finalize().toString(),file:file.name,state:1,checked:false})
    // sha256=null
    sha256.reset();
    // console.log('正在加密',index,(new Date().getTime()-this.startTime)/1000,'秒',sha256.finalize().toString(),file.name)
    this.cumulation++
    // this.trigger('calculateHash',{index:this.start,state:this.state})//每次加密
    if(index==this.files.length){
      this.state='end'
      this.trigger('groupEncryption',this.hash)
      this.trigger('end',{index:this.start,state:this.state})//每次加密
      this.hash=[];
    }else{
      if(this.cumulation%5==0){
        
    //  console.log('%c ------------------------------','color:red')
        this.start++
        this.state='free'
        this.encryptingFile();
        this.trigger('groupEncryption',this.hash)
        this.hash=[];
      }
    }
    
    
    // console.log( sha256.finalize().toString())
    this.completed = true;
  }
  
}
