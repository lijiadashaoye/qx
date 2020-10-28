<template>
  <div id="templateAdd" >
    
    <div class="templatebox">
      <div id="template">
        <div
          style="height:33px;font-size:24px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(60,65,88,1); line-height:33px;margin-bottom:10px;"
        >
          素材组件
        </div>
        <div
          @click="setNavigation($event)"
          :class="{ 'tem-pages': true }"
          data="noactive"
        >
          <img
            :class="{ img_: true, 'click_tmp-tem': clickTmp == 'presetImg' }"
            src="~assets/img/presetImg.png"
          />
          <div class="text">证书设置</div>
        </div>
        <div
          @click="setTmpItem($event, 'presetText')"
          :class="{ 'tem-pages': true }"
        >
          <img
            :class="{ img_: true, 'click_tmp-tem': clickTmp == 'presetText' }"
            src="~assets/img/presetText.png"
          />
          <div class="text">预置文本</div>
        </div>
        <div
          @click="setTmpItem($event, 'textComponent')"
          :class="{ 'tem-pages': true }"
          data="noactive"
        >
          <img
            :class="{
              img_: true,
              'click_tmp-tem': clickTmp == 'textComponent'
            }"
            src="~assets/img/textComponent.png"
          />
          <div class="text">文本框</div>
        </div>
        <div
          @click="setTmpItem($event, 'presetImg')"
          :class="{ 'tem-pages': true }"
          data="noactive"
        >
          <img
            :class="{ img_: true, 'click_tmp-tem': clickTmp == 'presetImg' }"
            src="~assets/img/presetImg.png"
          />
          <div class="text">预置图片</div>
        </div>
        <div
          @click="setTmpItem($event, 'imgComponent')"
          :class="{ 'tem-pages': true }"
          data="noactive"
        >
          <img
            :class="{ img_: true, 'click_tmp-tem': clickTmp == 'imgComponent' }"
            src="~assets/img/imgComponent.png"
          />
          <div class="text">占位图</div>
        </div>
        <!-- <div
          @click="setTmpItem($event, 'qrcode')"
          :class="{ 'tem-pages': true }"
          data="noactive"
        >
          <img
            :class="{ img_: true, 'click_tmp-tem': clickTmp == 'qrcode' }"
            src="~assets/img/comqrcode.png"
          />
          <div class="text">二维码</div>
        </div> -->
      </div>
      <dragBox @mouseEnd="regionEnd">
        <div
          id="phone"
          data="noactive"
          :style="{
            width: Number(domwidth) + 10 + 'px',
            height: '842px',
            overflow: 'auto',
            display: 'flex',
            position: 'relative'
          }"
        >
          <!-- width: '100%', -->
          <!-- 首页 -->
          <div
            class="scroll_phone"
            :style="{
              width: Number(templateForm.width) + 'px',
              height: Number(templateForm.height) + 'px'
            }"
          >
            <div
              class="phone-set-box"
              :style="{
                width: Number(templateForm.width) + 'px',
                height: Number(templateForm.height) + 'px',
                backgroundImage: 'url(' + certificateImage + ')',
                backgroundSize: '100% 100%',
                backgroundPosition: '50% 50%',
                backgroundColor: templateForm.bgColor,
                backgroundRepeat: ' no-repeat',
                marginLeft:
                  domwidth - Number(templateForm.width) > 0
                    ? (domwidth - Number(templateForm.width)) / 2 + 'px'
                    : 'auto'
              }"
            >
              <div
                class="box_phone"
                :style="{
                  border: '1px solid #dedede',
                  height: templateForm.height + 'px'
                }"
              >
              <!-- 多选组件虚拟框 -->
                <VueDragResize
                  v-if="isShowMultipleCom"
                  :key="'multipleCom_0'"
                  :ref="'multipleCom_0'"
                  :w="multipleCom.width"
                  :h="multipleCom.height"
                  :x="multipleCom.left"
                  :aspectFactor="multipleCom.aspectFactor"
                  :y="multipleCom.top"
                  :parentW="parseInt(templateForm.width)"
                  :parentKey_mo="'multipleCom_0'"
                  :parentH="parentH"
                  :axis="multipleCom.axis"
                  :isActive="multipleCom.active"
                  :minw="multipleCom.minw"
                  :minh="multipleCom.minh"
                  :isDraggable="false"
                  :isResizable="false"
                  :parentLimitation="true"
                  :snapToGrid="false"
                  :aspectRatio="setComLock"
                  :z="0"
                >
                  <div class="filler filler_"></div>
                </VueDragResize>
                <VueDragResize
                  v-if="rects.length > 0"
                  v-for="(rect, index) in rects"
                  :key="rect.key"
                  :key_="rect.key"
                  :w="rect.width"
                  :h="rect.height"
                  :x="rect.left"
                  :y="rect.top"
                  :parentKey_mo="rect.key"
                  :parentW="parseInt(templateForm.width)"
                  :parentH="parseInt(templateForm.height)"
                  :axis="rect.axis"
                  :isActive="rect.active"
                  :minw="rect.minw"
                  :minh="rect.minh"
                  :isDraggable="true"
                  :isResizable="rect.resizable"
                  :parentLimitation="rect.parentLim"
                  :snapToGrid="rect.snapToGrid"
                  :aspectRatio="rect.type == 'qrcode' ? true : setComLock"
                  :z="rect.zIndex"
                  v-on:activated="activateEv(index, $event)"
                  v-on:deactivated="deactivateEv(index)"
                  v-on:dragging="changePosition($event, index)"
                  v-on:resizing="changeSize($event, index)"
                  v-on:refLineParams="getRefLineParams"
                  v-on:virtualCom="virtualCom($event)"
                >
                  <div
                    class="filler"
                    :style="{
                      backgroundColor: rect.color,
                      borderColor: rect.active ? '#35c55b' : '#b0afaf'
                    }"
                  >
                    <qrcode v-if="rect.type == 'qrcode'"></qrcode>
                    <presetImg
                      v-if="rect.type == 'presetImg'"
                      :comontTmp="rect"
                      @setPresetImg="setPresetImg"
                    ></presetImg>

                    <!-- <temText v-if="rect.type=='textComponent'"></temText> -->
                    <tmpImg v-if="rect.type == 'imgComponent'"></tmpImg>
                    <presetText
                      v-if="
                        rect.type == 'presetText' ||
                          rect.type == 'textComponent' ||
                          rect.type == 'title'
                      "
                      @resetResizable="resetResizable"
                      @resetHeight="resetHeight"
                      @setPlaceHolder="setPlaceHolder"
                      :item_="rect"
                    ></presetText>
                  </div>
                </VueDragResize>
                <span
                  class="ref-line v-line"
                  v-for="item in vLine"
                  v-show="item.display"
                  :style="{
                    left: item.position,
                    top: item.origin,
                    height: item.lineLength
                  }"
                />
                <span
                  class="ref-line h-line"
                  v-for="item in hLine"
                  v-show="item.display"
                  :style="{
                    top: item.position,
                    left: item.origin,
                    width: item.lineLength
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </dragBox>
      <div id="setComItem" data="noactive">
        <div
          style="height:33px;
        font-size:24px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(60,65,88,1);
        line-height:33px;"
        >
          组件设置
        </div>

        <div class="itemCom icon_button">
          <div class="delete_" title="删除" @click="deleterct">
            <div class="img deleteIcon"></div>
            <div>删除</div>
          </div>
          <div class="setTop_" title="顶层" @click="setZindex($event, 'top')">
            <div class="img topIcon"></div>
            <div>顶层</div>
          </div>
          <div
            class="setBottom_"
            title="底层"
            @click="setZindex($event, 'bottom')"
          >
            <div class="img bottomIcon"></div>
            <div>底层</div>
          </div>
        </div>
        <div class="itemCom XYCom">
          <div class="setX_">
            <!-- v-model="input"  -->
            <div class="input_">
              <!-- <el-input :disabled="!isSettingDisabled.area" v-model="setParams.width"  :style="'width:100%'" ></el-input> -->
              <el-input
                :disabled="!isSettingDisabled.xy || setComLock"
                @focus="comXYfocus($event, 'X')"
                @blur="comXYBlur($event, 'X')"
                v-model="comX"
                @keyup.native="valiteXY($event, 'X')"
                :controls="false"
                :style="'width:100%'"
                :debounce="100"
              >
                <span slot="suffix" class="setAfter">X</span>
              </el-input>
            </div>
          </div>
          <div :class="{ lock: true }"></div>
          <div class="setY_">
            <div class="input_">
              <!-- <el-input :disabled="!isSettingDisabled.area" v-model="setParams.height"  :style="'width:100%'"></el-input> -->
              <el-input
                :disabled="!isSettingDisabled.xy || setComLock"
                @focus="comXYfocus($event, 'Y')"
                @blur="comXYBlur($event, 'Y')"
                v-model="comY"
                @keyup.native="valiteXY($event, 'Y')"
                :controls="false"
                :style="'width:100%'"
                :debounce="100"
              >
                <span slot="suffix" class="setAfter">Y</span>
              </el-input>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="itemCom WHCom">
          <div class="setWidth_">
            <!-- v-model="input"  -->
            <div class="input_">
              <!-- <el-input :disabled="!isSettingDisabled.area" v-model="setParams.width"  :style="'width:100%'" ></el-input> -->
              <!-- @change="comWidthHeightChange($event, 'widthInputnumber')" -->
              <el-input
                :disabled="!isSettingDisabled.area || setComLock"
                @keyup.native="valiteWH($event, 'widthInputnumber')"
                
                v-model="comWidth"
                :controls="false"
                :step="5"
                :style="'width:100%'"
                :debounce="100"
              >
                <span slot="suffix" class="setAfter">W</span>
              </el-input>
            </div>
            <!-- <div>宽度</div> -->
          </div>
          <div
            :class="{ lock: setComLock, unlock: !setComLock }"
            @click="setComLockState"
          ></div>
          <div class="setHeight_">
            <div class="input_">
              <!-- <el-input :disabled="!isSettingDisabled.area" v-model="setParams.height"  :style="'width:100%'"></el-input> -->
              <!-- el-input-number -->
                <!-- @change="comWidthHeightChange($event, 'heightInputnumber')" -->
              <el-input
                :disabled="!isSettingDisabled.area || setComLock"
                @keyup.native="valiteWH($event, 'heightInputnumber')"
              
                v-model="comHeight"
                :controls="false"
                :step="5"
                :style="'width:100%'"
                :debounce="100"
              >
                <span slot="suffix" class="setAfter">H</span>
              </el-input>
            </div>
            <!-- <div>高度</div> -->
          </div>
        </div>
        <div
          class="itemCom"
          style="height:1px;border-bottom:1px solid #E4E7ED"
        ></div>

        <div class="itemCom fontStyle">
          <div
            style="height:33px;
            font-size:16px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(60,65,88,1);
            line-height:33px;"
          >
            字体
          </div>
          <div class="fontOther">
            <div class="fontFamily_" style="width:150px;">
              <!--  -->
              <el-select
                :disabled="!isSettingDisabled.font"
                @change="comfontFamilyChange"
                :popper-append-to-body="false"
                popper-class="noactive"
                v-model="comfontFamily"
                placeholder="请选择字体"
              >
                <el-option
                  v-for="(item, index) in fontFamily"
                  :key="index + '_fontSize'"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="fontWeight">
              <div
                :style="{
                  cursor: !isSettingDisabled.font ? 'not-allowed' : 'pointer'
                }"
                class="fontWeight_img"
                @click="setFontWeight(comfontWeight)"
                :class="{ activeFW: comfontWeight }"
              ></div>
            </div>
          </div>

          <div class="fontOther">
            <div class="setColorM">
              <!-- v-model="color4" -->

              <!-- <colorPicker v-model="labelcolor" :data="'noactive'" defaultColor="#ff0000" @change="labelcolor_reset"  /> -->
              <el-color-picker
                color-format="rgb"
                :show-alpha="true"
                :disabled="!isSettingDisabled.font"
                :predefine="predefineColors"
                :style="{ width: '100%', height: '100%' }"
                @change="labelcolor_reset"
                :popper-append-to-body="false"
                popper-class="noactive"
                style="height:2rem;width:2rem;"
                v-model="labelcolor"
              ></el-color-picker>
            </div>
            <div>
              <el-select
                :disabled="!isSettingDisabled.font"
                :style="{ width: '100%', height: '100%' }"
                filterable
                allow-create
                default-first-option
                @change="labelSize_reset"
                style="width:5.5rem;height:2rem;"
                :popper-append-to-body="false"
                popper-class="noactive"
                v-model="labelFontsize"
                placeholder="字体大小"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div
          class="itemCom"
          style="height:1px;border-bottom:1px solid #E4E7ED"
        ></div>
        <div class="itemCom text_icon_button">
          <div
            style="height:33px;width:100%; font-size:16px; font-family:PingFangSC-Medium,PingFang SC;  font-weight:500;
            color:rgba(60,65,88,1); line-height:33px;"
          >
            对齐方式
          </div>
          <div class="horizontal">
            <div
              class="img leftIcon"
              title="左对齐"
              @click="textAlignChange($event, 'left')"
              :class="{
                activeLicon: isSettingDisabled.align && textAlign == 'left',
                notAllow: !isSettingDisabled.align,
                leftIcon_: isSettingDisabled.align
              }"
            ></div>
            <div
              class="img centerIcon"
              title="居中对齐"
              @click="textAlignChange($event, 'center')"
              :class="{
                activeCicon: isSettingDisabled.align && textAlign == 'center',
                notAllow: !isSettingDisabled.align,
                centerIcon_: isSettingDisabled.align
              }"
            ></div>
            <div
              class="img rightIcon"
              title="右对齐"
              @click="textAlignChange($event, 'right')"
              :class="{
                activeRicon: isSettingDisabled.align && textAlign == 'right',
                notAllow: !isSettingDisabled.align,
                rightIcon_: isSettingDisabled.align
              }"
            ></div>
            <!-- <div class="img betweenCenterIcon " @click="textAlignChange($event,'justify')"
                 :class="{activeBicon:isSettingDisabled.align && textAlign=='justify',notAllow:!isSettingDisabled.align,betweenCenterIcon_:isSettingDisabled.align}">
            </div>-->
          </div>
          <div class="vertical">
            <div
              class="img vTopIcon"
              title="顶部对齐"
              @click="verticalAlignChange($event, 'top')"
              :class="{
                activeVTicon: isSettingDisabled.align && verticalAlign == 'top',
                notAllow: !isSettingDisabled.align,
                vTopIcon_: isSettingDisabled.align
              }"
            ></div>
            <div
              class="img vCenterIcon"
              title="垂直居中对齐"
              @click="verticalAlignChange($event, 'middle')"
              :class="{
                activeVCicon:
                  isSettingDisabled.align && verticalAlign == 'middle',
                notAllow: !isSettingDisabled.align,
                vCenterIcon_: isSettingDisabled.align
              }"
            ></div>
            <div
              class="img vBottomIcon"
              title="底部对齐"
              @click="verticalAlignChange($event, 'bottom')"
              :class="{
                activeVBicon:
                  isSettingDisabled.align && verticalAlign == 'bottom',
                notAllow: !isSettingDisabled.align,
                vBottomIcon_: isSettingDisabled.align
              }"
            ></div>
          </div>
        </div>
        <div
          class="itemCom"
          style="height:1px;border-bottom:1px solid #E4E7ED"
        ></div>
        <div class="itemCom fontStyle">
          <div
            style="height:1.65rem;width:100%; font-size:0.8rem; font-family:PingFangSC-Medium,PingFang SC;  font-weight:500;
            color:rgba(60,65,88,1); line-height:1.65rem;"
          >
            组件背景颜色
          </div>
          <div class="fontOther">
            <div class="setColorM">
              <el-color-picker
                :disabled="!isSettingDisabled.font"
                color-format="rgb"
                :show-alpha="true"
                :predefine="predefineColors"
                :style="{ width: '100%', height: '100%' }"
                @change="backgroundColor_reset"
                :popper-append-to-body="false"
                popper-class="noactive"
                style="height:2rem;width:2rem;"
                v-model="combackgroundColor"
              ></el-color-picker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top:30px;">
      <el-form
        :model="dynamicValidateForm"
        label-position="left"
        ref="dynamicValidateForm"
        label-width="100px"
        class="demo-dynamic temname"
      >
        <el-form-item
          prop="tmpname"
          label="模板名称"
          :rules="[
            { required: true, message: '请输入模板名称', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="dynamicValidateForm.tmpname"
            placeholder="请输入模板名称，最多30字"
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item :label="'使用权限'">
          <el-button style="width:140px;" type="primary" @click="addOprate(1)"
            >添加使用权限
          </el-button>
          <div v-if="companyAuthIds.length > 0" class="box_">
            <div
              v-for="it in companyAuthIds"
              :key="it.treeId"
              style="width:auto;"
            >
              {{ it.name }}
              <div
                class="box_close el-icon-close"
                @click="deleteTreeItem(it, 1)"
              ></div>
            </div>
          </div>
          <div v-if="companyIds.length > 0" class="box_">
            <div v-for="it in companyIds" :key="it.treeId">
              {{ it.username }}
              <div
                class="box_close el-icon-close"
                @click="deleteTreeItem(it, 2)"
              ></div>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="'模板编辑人'">
          <el-button type="primary" @click="addOprate(2)"
            >添加模板编辑人</el-button
          >
          <div v-if="sysUserAuthIds.length > 0" class="box_">
            <div
              v-for="it in sysUserAuthIds"
              :key="it.treeId"
              style="width:auto;"
            >
              {{ it.name }}
              <div
                class="box_close el-icon-close"
                @click="deleteTreeItem(it, 3)"
              ></div>
            </div>
          </div>
          <div v-if="sysUserIds.length > 0" class="box_">
            <div v-for="it in sysUserIds" :key="it.treeId">
              {{ it.username }}
              <div
                class="box_close el-icon-close"
                @click="deleteTreeItem(it, 4)"
              ></div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      data="noactive"
      class="navDialog"
      :center="false"
      :title="'证书设置'"
      @close="canceTolist"
      :visible.sync="setNavigationSync"
      width="27rem"
    >
      <el-form
        :model="navigationForm"
        class="navigation"
        label-position="left"
        :label-width="'7.5rem'"
        :label-position="'left'"
      >
        <el-form-item label="证书模板大小">
          <el-input
            style="width:6rem"
            type="text"
            v-model="navigationForm.width"
          ></el-input>
          <span style="display:inline-block;width:1.5rem ;text-align:center"
            >*</span
          >
          <el-input
            style="width:6rem"
            type="text"
            v-model="navigationForm.height"
          ></el-input>
        </el-form-item>
        <el-form-item label="设置证书背景颜色">
          <!-- <el-input type="text" v-model="navigationForm.bgColor" :rows="4"></el-input> -->
          <!-- @change="labelcolor_reset" -->
          <el-color-picker
            color-format="rgb"
            :show-alpha="true"
            :predefine="predefineColors"
            :style="{ width: '100%', height: '100%' }"
            :popper-append-to-body="false"
            popper-class="noactive"
            style="height:2rem;width:2rem;"
            v-model="navigationForm.bgColor"
          ></el-color-picker>
        </el-form-item>
        <el-form-item label="上传证书背景图片">
          <el-upload
            class="navigation-uploader"
            :action="baseapi"
            :data="{ type: 1 }"
            :show-file-list="false"
            :headers="{ token: token }"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-button
              size="small"
              type="primary"
              :style="{ width: '14rem', height: '2rem' }"
              >上传证书背景图</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item
          v-if="navigationForm.bgImg.length > 0"
          label
          :label-width="'150px'"
          :label-position="'left'"
        >
          <div class="bgImgBox" :style="{ height: 'auto', width: '13.9rem' }">
            <i
              class="el-icon-error"
              :style="{
                float: 'right',
                cursor: 'pointer',
                marginRight: '-10px'
              }"
              @click="
                navigationForm.bgImg = '';
                this.certificateImage = '';
              "
            ></i>
            <img
              height="auto"
              width="100%"
              :src="navigationForm.bgImg + '?imageMogr2/auto-orient'"
              alt
            />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="setNavigationSync = false"
          :style="{ height: '2rem' }"
          >取 消</el-button
        >
        <el-button
          type="primary"
          data="noactive"
          :style="{ height: '2rem' }"
          @click="subNavigationForm"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- :style="'width:570px;height:804px'" -->
    <el-dialog
      class="preView"
      ref="previewcer"
      data="noactive"
      title="证书预览"
      @close="handleClose"
      :visible.sync="previewCertificate"
      :width="Number(domwidth) + 55 + 'px'"
    >
   
    <div
     class="phone-set"
    :style="{
       maxWidth: Number(domwidth+15) + 'px',
          maxHeight: '842px',
          overflow: 'auto',
          marginLeft:
            Number(domwidth) - Number(templateForm.width) > 0
              ? (Number(domwidth) - Number(templateForm.width)) / 2 + 'px'
              : '0px',
               width: Number(domwidth.width)+15 + 'px'
    }">
      <div
        class="phone-set-box "
        style="position:relative;"
        :style="{
         
          height: templateForm.height + 'px',
          width: templateForm.width + 'px'
        }"
      >
        <div
          :style="{
            height: templateForm.height + 'px',
            width: templateForm.width + 'px',
            background:
              'url(' + certificateImage + '?imageMogr2/auto-orient)  no-repeat',
            backgroundSize: '100% 100%',
            backgroundPosition: '50% 50%',
            backgroundColor: templateForm.bgColor
          }"
        >
          <!-- phoneboxHieght/20+'rem' -->
          <VueDragResize
            v-if="rects.length > 0"
            v-for="(rect, index) in rects"
            :style="{ display: rect.type != 'wenben' ? 'block' : 'none' }"
            :isshowIcon="false"
            :key="rect.key"
            :w="rect.width"
            :h="rect.height"
            :x="rect.left"
            :y="rect.top"
             :parentW="parseInt(templateForm.width)"
            :parentH="parseInt(templateForm.height)"
            :axis="rect.axis"
            :isActive="false"
            :minw="rect.minw"
            :minh="rect.minh"
            :isDraggable="false"
            :isResizable="false"
            :parentLimitation="rect.parentLim"
            :snapToGrid="rect.snapToGrid"
            :aspectRatio="rect.aspectRatio"
            :z="rect.zIndex"
            v-on:activated="activateEv(index, $event)"
            v-on:deactivated="deactivateEv(index)"
            v-on:refLineParams="getRefLineParams"
            v-on:dragging="changePosition($event, index)"
            v-on:resizing="changeSize($event, index)"
          >
            <qrcode v-if="rect.type == 'qrcode'"></qrcode>
            <presetImg
              v-if="rect.type == 'presetImg'"
              :ispreView="true"
              :comontTmp="rect"
              @setPresetImg="setPresetImg"
            ></presetImg>

            <tmpImg v-if="rect.type == 'imgComponent'"></tmpImg>
            <presetText
              v-if="rect.type == 'presetText' || rect.type == 'textComponent'"
              :item_="rect"
            ></presetText>
          </VueDragResize>
        </div>
      </div>
      </div>
      <div v-if="previewSave" slot="footer" style="text-align:center">
         <el-button :style="'width:8rem'" @click="previewCertificate=false"
        >取消</el-button
      >
         <el-button
        :style="'width:8rem'"
        type="primary"
        @click="submitForm($event, 'dynamicValidateForm')"
        >保存</el-button
      >
      </div>
    </el-dialog>
    <!-- <toolbar></toolbar> -->
    <div
      id="submit"
      class="submit"
      style="margin-top:30px;text-align: center;width:calc(100% );margin-bottom:30px;"
    >
      <!-- data="noactive" -->
      <el-button :style="'width:11rem'" @click="precivewCertifi()"
        >浏览</el-button
      >
      <el-button :style="'width:11rem'" @click="callbackCertificate($event)"
        >退出</el-button
      >
      <!-- data="noactive" -->
      <el-button
        :style="'width:11rem'"
        type="primary"
        @click="precivewCertifi('save')"
        >预览并保存</el-button
      >
    </div>
   
    <!-- <div
      data-v-df1c1520
      id="ruler"
      class
      :style="{ width: widthVlible }"
      style="top: 237px; left: 210px; z-index: 3; "
    >
      <div data-v-df1c1520 class="filler">
        debugger
        <div data-v-0a6a399b data-v-df1c1520 class="presettext">
          <div
            data-v-0a6a399b
            class="label"
            style="color: rgb(101, 109, 146); font-size: 14px; white-space: pre-wrap; word-break: break-all;"
          ></div>
        </div>
      </div>
    </div> -->
    <el-dialog
      :close-on-click-modal="false"
      class="diloag diloagTwo"
      :title="'设置授权'"
      :visible.sync="isSetting"
      width="21rem"
    >
      <div style="    max-height: 300px; overflow-y: auto;">
        <!-- @check-change="treeCheckChange"  :default-checked-keys="companyAuthList"-->

        <el-tree
          node-key="treeId"
          :props="props"
          :default-expand-all="false"
          show-checkbox
          :check-strictly="true"
          ref="tree"
          :load="loadNode_"
          lazy
          :check-on-click-node="true"
          @check-change="(a, b) => treeCheckChange(a, b, 1)"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <i
              class="iconfont"
              style="color:#F76A0D;"
              :class="{
                'icon-zuzhiguanli': node.data.treeId.indexOf('de_') >= 0,
                'icon-yonghu': node.data.treeId.indexOf('com_') >= 0
              }"
            ></i>
            {{ node.label }}
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dilaogBtn" style="text-align:left">
        <el-button @click="isSetting = false">取消</el-button>
        <el-button @click="getKey(1)" style="width:auto" type="primary"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      class="diloag diloagTwo"
      :title="'设置编辑人'"
      :visible.sync="isSetting_"
      width="21rem"
    >
      <div style="    max-height: 300px; overflow-y: auto;">
        <!-- @check-change="treeCheckChange_"  :default-checked-keys="sysUserAuthList"-->
        <el-tree
          node-key="treeId"
          :props="props"
          :default-expand-all="false"
          show-checkbox
          :check-strictly="true"
          ref="tree_"
          :load="loadNode_"
          :check-on-click-node="true"
          lazy
          @check-change="(a, b) => treeCheckChange(a, b, 2)"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <i
              class="iconfont"
              style="color:#F76A0D;"
              :class="{
                'icon-zuzhiguanli': node.data.treeId.indexOf('de_') >= 0,
                'icon-yonghu': node.data.treeId.indexOf('sysu_') >= 0
              }"
            ></i>
            {{ node.label }}
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dilaogBtn" style="text-align:left;">
        <el-button @click="isSetting_ = false">取消</el-button>
        <el-button @click="getKey(2)" style="width:auto" type="primary"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { algorithm, throttle } from "utils/comFunc";
import {
  templateList,
  templateFindTPageByTId,
  templateUpdateStatus,
  templateDeleteById,
  templateAddOrUpdate,
  templateAddPermission,
  templateSavePage,
  companyList,
  companyFindByName,
  getSysUserAuthList,
  screenDepartmentByIds
} from "src/api/template";
import VueDragResize from "src/components/vue-drag-resize/vue-drag-resize.vue";
import temText from "./components/temText";
import presetText from "./components/presetText";
import presetImg from "./components/presetImg";
import { isSettingDisabled, preStep } from "utils/templateControler";
import sha256 from "sha256";
import qrcode from "./components/qrcode";
import tmpImg from "./components/tmpImg";
import upload from "./components/upload";
import dragBox from "../../components/dragBox";
export default {
  components: {
    presetImg,
    temText,
    presetText,
    VueDragResize,
    qrcode,
    tmpImg,
    dragBox
  },

  data() {
    return {
      previewSave:false,
      enum_: {
        presetText: {
          height: 24,
          fontSize: 18,
          width: 135,
          top: 409,
          left: 230
        },
        textComponent: {
          height: 24,
          fontSize: 18,
          width: 112,
          top: 409,
          left: 241
        },
        presetImg: {
          height: 200,
          fontSize: 14,
          width: 355,
          top: 320,
          left: 120
        },
        imgComponent: {
          height: 200,
          fontSize: 14,
          width: 355,
          top: 320,
          left: 120
        },
        qrcode: { height: 71, fontSize: 14, width: 71, top: 346, left: 222 }
        // presetMedia: { height: 200, fontSize: 14, width: 355 },
        // mediaComponent: { height: 200, fontSize: 14, width: 355 }
      },
      debounceXYBlur: throttle(this.setXYBlurFocus, 500, this, false),
      throttleXY: throttle(this.setXY, 500, this, false),
      isShowMultipleCom: false,
      multipleCom: null,
      token: "",
      domwidth: 595, //屏幕最大宽度
      time: null,
      ctrlC: {}, //复制组件
      baseapi: window.g.apiurl + "/certadmin/oss/upload",
      timerForMessage: false,
      navigationForm: {
        bgImg: "",
        bgColor: "rgba(246,246,246,1)",
        height: 842,
        used: false,
        width: 595
      },
      setNavigationSync: true,
      isFirst: true,
      templateForm: {
        width: 595,
        height: 842,
        bgColor: "rgba(246,246,246,1)"
      },
      props: {
        value: "treeId",
        label: "treeName",
        children: "child",
        isLeaf: "isLeaf",
        disabled: "disabled"
      },
      companyIds: [], //	是	Long数组	企业Id列表
      companyAuthIds: [], //	是	Long 数组	企业组织id（使用权限）
      sysUserIds: [], //	是	Long 数组	成员ID列表
      sysUserAuthIds: [], //	是	Long 数组	成员组织id（模版编辑权限）
      navbarInfor: [], //	是	String	模版导航信息
      departmentList: [],
      isSetting: false,
      isSetting_: false,
      oldRect: null,
      setComLock: false,
      recordActiveRects: null,
      otherTemForm: { name: "" },
      othersycn: false,
      lastStepCallback: false,
      editComid: "", //修改组件的id
      edited: false,
      title_: 2,
      // uploadHeader: {
      //   token: JSON.parse(sessionStorage.getItem("userInfo")).token
      // },
      bgUploading: false,
      // uploadaction: "/certadmin/oss/upload",
      dragBG: require("src/assets/img/dragBG.png"),
      certificateImage: "", //require('src/assets/img/certificate.png'),//require('src/assets/img/certificate.png'),
      previewCertificate: false,
      bgImg: [],

      options_: [],
      value: [],
      list: [],
      textTitle: "预置文本内容",
      predefineColors: [
        "#000000",
        "#ffffff",
        "#eeece1",
        "#1e497b",
        "#4e81bb",
        "#e2534d",
        "#9aba60",
        "#8165a0",
        "#47acc5",
        "#f9974c",
        "#c21401",
        "#ff1e02",
        "#ffc12a",
        "#ffff3a",
        "#90cf5b",
        "#00af57",
        "#00afee",
        "#0071be",
        "#00215f",
        "#72349d",
        "#f2f2f2",
        "#808080",
        "#ddd8c3",
        "#c6d9f0",
        "#dae5f0",
        "#f2dbdb",
        "#eaf1de",
        "#e6e0ec",
        "#d9eef3",
        "#fee9da",
        "#dbdbdb",
        "#696969",
        "#b6b29f",
        "#a1b4cc",
        "#b5c3d2",
        "#d5b6b6",
        "#cad4ba",
        "#c4bdcc",
        "#b3d0d7",
        "#e9c9b1",
        "#c4c4c4",
        "#525252",
        "#8f8c7b",
        "#7c90a8",
        "#90a2b5",
        "#b89291",
        "#abb796",
        "#a39aad",
        "#8eb2bb",
        "#d5a988",
        "#adadad",
        "#3b3b3b",
        "#696657",
        "#576c84",
        "#6c8198",
        "#9c6e6c",
        "#8b9a73",
        "#81778e",
        "#68949f",
        "#c18960",
        "#969696",
        "#242424",
        "#424033",
        "#324860",
        "#47607b",
        "#7f4a47",
        "#6c7d4f",
        "#60546f",
        "#437683",
        "#ad6937"
      ],
      loading: false,
      moduleTitle__: [],
      phoneboxHieght: 804,
      // 组件设置参数
      comfontFamily: "Arial", //字体
      comfontWeight: false, //字体粗细
      combackgroundColor: "rgba(255,255,255,0)",
      labelFontsize: "14", //字号
      labelcolor: "#848484", //字体颜色
      comWidth: "40",
      comHeight: "40",
      comX: 0,
      comY: 0,
      textAlign: "center",
      verticalAlign: "middle",
      fontFamily: [
        { value: "Arial", label: "Arial" },
        { value: "黑体", label: "黑体" },
        { value: "宋体", label: "宋体" },
        { value: "微软雅黑", label: "微软雅黑" },
        { value: "仿宋", label: "仿宋" },
        { value: "方正姚体", label: "方正姚体" },
        { value: "华文行楷", label: "华文行楷" },
        { value: "楷体", label: "楷体" },
        // { value: "方正舒体", label: "方正舒体" },
        { value: "幼圆", label: "幼圆" },
        { value: "华文中宋", label: "华文中宋" },
        { value: "隶书", label: "隶书" }
      ],
      optionsEditor_: [],
      moduleTitle__: [],
      setLabelDisable: true,
      phoneboxHieght: 842,
      phoneboxOuterHieght: 837,
      options: [
        {
          value: "10",
          label: "10px"
        },
        {
          value: "12",
          label: "12px"
        },
        {
          value: "14",
          label: "14px"
        },
        {
          value: "16",
          label: "16px"
        },
        {
          value: "18",
          label: "18px"
        },
        {
          value: "20",
          label: "20px"
        },
        {
          value: "22",
          label: "22px"
        },
        {
          value: "24",
          label: "24px"
        },
        {
          value: "26",
          label: "26px"
        },
        {
          value: "28",
          label: "28px"
        },
        {
          value: "36",
          label: "36px"
        },
        {
          value: "48",
          label: "48px"
        },
        {
          value: "72",
          label: "72px"
        }
      ],
      dynamicValidateForm: {
        tmpname: "",
        id: ""
      },
      isEdit: false,
      input: "",
      active: "pageindex",
      clickTmp: "",
      presetTextSync: false,
      form: {
        name: ""
      },
      saveActive: null,
      parentH: 1800,
      widthVlible: "auto", //设置隐藏的div的宽度
      //红色参照线
      vLine: [], //{display: true, position: "187px", origin: "0px", lineLength: "580px"}
      hLine: [],
      isSettingDisabled: {}
    };
  },
  created() {
    var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};



    this.token = JSON.parse(sessionStorage.getItem("userInfo")).token;
    var _this = this;
    localStorage.removeItem("rects_");
    document.documentElement.removeEventListener("keyup", this.listenKeyup);
    document.documentElement.addEventListener("keyup", this.listenKeyup);
    document.documentElement.removeEventListener("keydown", this.listenKeyDown);
    document.documentElement.addEventListener("keydown", this.listenKeyDown);

    localStorage.removeItem("arr");
    this.$store.dispatch("dragLesize/get_rects", { url: null });

    let sha256String = sha256(
      JSON.stringify(this.rects).replace(/"active":true/g, '"active":false')
    );
    localStorage.setItem("tmpData", sha256String);
    this.$nextTick(() => {
      this.resetParentHeight();

      // this.setActiveModuleStatus()
    });
    this.preStep(this.$store.state.dragLesize.rects, this.active);
    this.isSettingDisabled = isSettingDisabled();
  },

  computed: {
    sysUserAuthList() {
      let depart = this.sysUserAuthIds.map(item => {
        return item.treeId;
      });
      let users = this.sysUserIds.map(item => {
        return item.treeId;
      });
      return [].concat(...depart, ...users);
    },
    companyAuthList() {
      let depart = this.companyAuthIds.map(item => {
        return item.treeId;
      });
      let coms = this.companyIds.map(item => {
        return item.treeId;
      });
      return [].concat(...depart, ...coms);
    },

    activeRect() {
      return this.$store.getters["getActive"];
    },
    rects() {
      this.saveActive = this.$store.getters["getActive"];

      // this.lastStep(this.$store.state.dragLesize.rects);

      if (
        !!this.$store.getters["getAllActive"] &&
        this.$store.getters["getAllActive"].length == 1
      ) {
        let activeRect_ = this.$store.state.dragLesize.rects[
          this.$store.getters["getActive"]
        ];

        this.setLabelDisable = false;

        this.labelcolor = activeRect_.fontColor;
        this.labelFontsize = activeRect_.fontSize;
      }
      return this.$store.state.dragLesize.rects;
    }
  },
  mounted() {},
  watch: {
    textAlign(n, o) {

      if (n != 0 && o != "center") {
        this.$store.dispatch("dragLesize/setComAttr", {
          key: this.$store.state.dragLesize.rects[
            this.$store.getters["getActive"]
          ].key,
          attr: "textAlign",
          value: n
        }); //设置组件
      }
    },
    verticalAlign(n, o) {

      if (n != o && o != "middle") {
        this.$store.dispatch("dragLesize/setComAttr", {
          key: this.$store.state.dragLesize.rects[
            this.$store.getters["getActive"]
          ].key,
          attr: "verticalAlign",
          value: n
        }); //设置组件
      }
    },
    rects: {
      handler(newd, oldd) {
        if (
          !!this.$store.getters["getAllActive"] &&
          this.$store.getters["getAllActive"].length == 1
        ) {
          this.recordActiveRects = this.$store.getters["getActive"]; //记录激活的组件的id,因为在点击页面其他地方的时候，会把激活的组件去激活，在设置宽高的时候已经被去激活了，所以要用此数据记录
          let active_item =
            this.$store.state.dragLesize.rects.length > 0
              ? this.$store.state.dragLesize.rects[
                  this.$store.getters["getActive"]
                ]
              : null;
          this.isSettingDisabled = isSettingDisabled(active_item.type);
          this.getAttrRect(active_item);
        } else {
          if (
            this.$store.getters["getAllActive"] &&
            this.$store.getters["getAllActive"].length > 1
          ) {
            this.isSettingDisabled = isSettingDisabled("multiple");
            if (this.isShowMultipleCom) {
              this.comX = this.multipleCom.left;
              this.comY = this.multipleCom.top;
              // this.comWidth=this.multipleCom.width
              // this.comHeight=this.multipleCom.height
            }
          } else {
            this.comX = 0;
            this.comY = 0;
            this.comWidth = 0;
            this.comHeight = 0;
            this.isSettingDisabled = isSettingDisabled();
          }
        }
        this.oldRect = oldd;
      },
      deep: true
    },
    presetText(newn, oldn) {
      if (!newn) {
        this.form.name = "";
      }
    },
    // 1.1.1
    dynamicValidateForm: {
      handler(newName, oldName) {
        if (newName) {
          if (newName.tmpname.length > 30) {
            this.dynamicValidateForm.tmpname = newName.tmpname.substr(0, 30);
          }
        }
      },
      // immediate: true,
      deep: true
    }
    // form: {
    //   handler(newName, oldName) {
    //     if (newName) {
    //       if (newName.name.length > 10) {
    //         this.form.name = newName.name.substr(0, 10);
    //       }
    //     }
    //   },
    //   // immediate: true,
    //   deep: true
    // }
  },
  methods: {
  
    //框选结束
    regionEnd() {
      if (
        !!this.$store.getters["getAllActive"] &&
        this.$store.getters["getAllActive"].length > 1
      ) {
        this.virtualCom(true, result => {
          this.virtualCom(false);
        });
      }
    },
    OSnow() {
      var agent = navigator.userAgent.toLowerCase();
      var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
      if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
        alert("这是windows32位系统");
      }
      if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
        alert("这是windows64位系统");
      }
      if (isMac) {
        alert("这是mac系统");
      }
    },
    //多选的时候会触发此方法
    virtualCom(status, callback) {
      let activeArr = this.$store.getters["getAllActive"];
      activeArr = !activeArr ? [] : activeArr;
      if (status && activeArr.length > 1) {
        //获取多选组件的最靠边的上下左右
        let maxObj = activeArr.reduce(
          (pre, cur) => {
            let obj = {};
            obj.left = !pre.left ? cur.left : Math.min(pre.left, cur.left);
            obj.top = !pre.top ? cur.top : Math.min(pre.top, cur.top);
            obj.width = Math.max(pre.width, cur.width + cur.left);
            obj.height = Math.max(pre.height, cur.height + cur.top);
            return obj;
          },
          { left: 0, top: 0, width: 0, height: 0 }
        );

        let options = {
          key: "multipleCom_0",
          type: null,
          width: maxObj.width - maxObj.left,
          height: maxObj.height - maxObj.top, //180,
          top: maxObj.top,
          left: maxObj.left,
          draggable: true,
          resizable: false,
          minw: 10,
          minh: 10,
          aspectFactor: 1,
          axis: "both",
          parentLim: true,
          snapToGrid: true,
          aspectRatio: false, //等比缩放
          zIndex: 0,
          active: true
        };
        this.multipleCom = Object.assign({}, options);
        this.isShowMultipleCom = true;
        this.comX = options.left;
        this.comY = options.top;
        this.comWidth = options.width;
        this.comHeight = options.height;
        if (callback) {
          return callback(this.multipleCom);
        }
      } else {
        this.isShowMultipleCom = false;
        this.$nextTick(() => {
          setTimeout(() => {
            this.multipleCom = null;
          }, 200);
        });
      }
    },
    // 树
    deleteTreeItem(item, type) {
      if (type == 1) {
        this.companyAuthIds = this.companyAuthIds.filter(ite => {
          return ite.id != item.id;
        });
      } else if (type == 2) {
        this.companyIds = this.companyIds.filter(ite => {
          return ite.id != item.id;
        });
      } else if (type == 3) {
        this.sysUserAuthIds = this.sysUserAuthIds.filter(ite => {
          return ite.id != item.id;
        });
      } else {
        this.sysUserIds = this.sysUserIds.filter(ite => {
          return ite.id != item.id;
        });
      }
    },
    //  授权编辑人去重
    repeatData(arr) {
      var hash = {};
      let data = arr.reduce(function(item, next) {
        hash[next.treeId] ? "" : (hash[next.treeId] = true && item.push(next));
        return item;
      }, []);
      return data;
    },
    // 授权编辑人设置组织机构
    async getKey(type) {
      if (type == 1) {
        let keys = this.$refs.tree.getCheckedNodes();
        let companyAuthIds = [],
          companyIds = [];
        keys.map(item => {
          if (item.treeId.indexOf("de_") >= 0) {
            companyAuthIds.push(item);
          }
          if (item.treeId.indexOf("sysu_") >= 0) {
            companyIds.push(item);
          }
        });

        let derp = this.repeatData(companyAuthIds); //this.repeatData(companyAuthIds.concat(this.companyAuthIds));
        if (derp.length > 1) {
          let derpids = derp.map(item => {
            return item.id;
          });
          screenDepartmentByIds({ departmentIds: derpids }).then(result => {
          

            this.companyAuthIds = derp.filter(
              item => result.indexOf(item.id) >= 0
            );
          });
        } else {
          this.companyAuthIds = derp;
        }
        // let com = this.repeatData(companyIds.concat(this.companyIds))
        let com = this.repeatData(companyIds);
        this.companyIds = com;
      } else {
        let keys_ = this.$refs.tree_.getCheckedNodes();

        let sysUserAuthIds = [],
          sysUserIds = [];
        keys_.map(item => {
          if (item.treeId.indexOf("de_") >= 0) {
            sysUserAuthIds.push(item);
          }
          if (item.treeId.indexOf("sysu_") >= 0) {
            sysUserIds.push(item);
          }
        });

        //  let der1 = this.repeatData(this.sysUserAuthIds.concat(sysUserAuthIds))
        let der1 = this.repeatData(sysUserAuthIds);
        if (der1.length > 1) {
          let derpids1 = der1.map(item => {
            return item.id;
          });
          screenDepartmentByIds({ departmentIds: derpids1 }).then(result => {
            this.sysUserAuthIds = der1.filter(
              item => result.indexOf(item.id) >= 0
            );
          });
        } else {
          this.sysUserAuthIds = der1;
        }
        // let com_ = this.repeatData(this.sysUserIds.concat(sysUserIds))
        let com_ = this.repeatData(sysUserIds);
        this.sysUserIds = com_;
      }
      this.$message({
        message: "设置成功！",
        type: "success"
      });
      this.isSetting = false;
      this.isSetting_ = false;
    },
    // 添加授权/编辑人操作
    addOprate(type) {
      if (type == 1) {
        this.departDiaTitle == 1;
        this.isSetting = true;
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.companyAuthList);
        });
      } else {
        this.departDiaTitle == 2;
        this.isSetting_ = true;
        this.$nextTick(() => {
          this.$refs.tree_.setCheckedKeys(this.sysUserAuthList);
        });
      }
    },
    treeCheckChange(nodeObj, ischeck, type) {
      if (!ischeck) {
        //取消的时候去掉页面的值

        if (nodeObj.treeId.indexOf("de_") >= 0) {
          //去掉了组织
          if (type == 1) {
            //授权
            this.companyAuthIds = this.companyAuthIds.filter(
              item => item.id != nodeObj.id
            );
          } else {
            //编辑人
            this.sysUserAuthIds = this.sysUserAuthIds.filter(
              item => item.id != nodeObj.id
            );
          }
        } else {
          //去掉成员
          if (type == 1) {
            //授权
            this.companyIds = this.companyIds.filter(
              item => item.id != nodeObj.id
            );
          } else {
            //编辑人
            this.sysUserIds = this.sysUserIds.filter(
              item => item.id != nodeObj.id
            );
          }
        }
      }
      // 设置组件是否禁选

      let node = null;

      if (type == 1) {
        node = this.$refs.tree.getNode(nodeObj);
      } else {
        node = this.$refs.tree_.getNode(nodeObj);
      }

      var theChildren = node.childNodes;
      if (theChildren.length < 1) {
        return false;
      }
      let arr = [];
      theChildren.map(item => {
        item.data.disabled = ischeck;
        arr.push(item.data);
        return item;
      });
      theChildren.splice(0, theChildren.length);
      node.doCreateChildren(arr);

      this.$forceUpdate();
    },

    async getSysUserAuthList_(id, fn, hasChecked) {
      let params = {
        parentId: id ? id : ""
      };
      let result = await getSysUserAuthList(params); //.then(result=>{
      result.departments.map(item => {
        item.treeId = "de_" + item.id;
        item.treeName = item.name;
        item.isLeaf = false;
        item.disabled = hasChecked;
        item.child = [];
      });
      result.sysUsers.map(item => {
        item.treeId = "sysu_" + item.id;
        item.treeName = item.username;
        item.isLeaf = true;
        item.disabled = hasChecked;
        item.child = null;
      });
      fn([].concat(...result.sysUsers, ...result.departments));
    },
    deepReset(arr, condition, children) {
      // 即将返回的数组
      let main = [];
      // 用try方案方便直接中止所有递归的程序
      try {
        // 开始轮询
        (function poll(arr, level) {
          // 如果传入非数组
          if (!Array.isArray(arr)) return;
          // 遍历数组
          for (let i = 0; i < arr.length; i++) {
            // 获取当前项
            const item = arr[i];
            item.level = level;
            // 先占位预设值
            main[level] = item;
            condition && condition(item, i, level);
            if (!!item.child) {
              poll(item[children], level + 1);
            }
          }
        })(arr, 0);
        // 使用try/catch是为了中止所有轮询中的任务
      } catch (err) {
        console.log(err);
      }
      // 返回最终数组

      return arr;
    },
    canceTolist(e) {
      if (this.isFirst) {
        this.$router.push({ path: "templateManagement" });
      }
    },
    // 证书设置
    subNavigationForm() {
      // if(this.navigationForm.width<100 ||this.navigationForm.height<100){//需求要求证书最小100
      if (this.navigationForm.width < 200 || this.navigationForm.height < 200) {
        //二维码设置默认是150
        this.$message({
          type: "error",
          message: "证书的宽高不能小于200*200"
        });
        return false;
      }
      // 判断组件的最大宽度和最大的高度
      if (this.$store.state.dragLesize.rects.length > 0) {
        let maxWidth = this.$store.state.dragLesize.rects.reduce((a, b) => {
          if (a.width > b.width) {
            return a;
          } else {
            return b;
          }
        });

        let maxTop = this.$store.state.dragLesize.rects.reduce((a, b) => {
          if (a.height > b.height) {
            return a;
          } else {
            return b;
          }
          //  return {height:a.height+b.height}
        });

        if (this.navigationForm.width < maxWidth.width) {
          this.navigationForm.width = this.templateForm.width;
          this.$message({
            type: "error",
            message: "证书的宽度不能小于组件的宽度"
          });
          return false;
        }
        if (this.navigationForm.height < maxTop.height) {
          this.navigationForm.height = this.templateForm.height;
          this.$message({
            type: "error",
            message: "证书的高度不能小于所有组件的高度"
          });
          return false;
        }

        // 重新设置组件的高度和宽度，

        this.$store.state.dragLesize.rects.map(item => {
          if (item.left + item.width > this.navigationForm.width) {
            item.left =
              item.left - (item.left + item.width - this.navigationForm.width);
          }
          if (item.top + item.height > this.navigationForm.height) {
            item.top =
              item.top - (item.height + item.top - this.navigationForm.height);
          }
          return item;
        });
      }
      this.isFirst = false; //是否第一次设置证书
      this.templateForm.width = this.navigationForm.width;
      this.templateForm.height = this.navigationForm.height;
      this.templateForm.bgColor = this.navigationForm.bgColor;

      if (this.navigationForm.bgImg.length > 0) {
        this.bgImg[0] = this.navigationForm.bgImg;
      }
      // 证书宽高改变以后重新设置组件的宽高left,top的初始值
      // 如果模板小于默认的宽高则重新设置enum_的left ,top

      let temWidth = Number(this.templateForm.width),
        temHeight = Number(this.templateForm.height);
      if (temWidth < 595 || temHeight < 842) {
        for (let k in this.enum_) {
          let itemCom = this.enum_[k];
          // itemCom.width=f
          if (temWidth < itemCom.width) {
            itemCom.width = temWidth;
            itemCom.left = 0;
          } else {
            // itemCom.width=temWidth;

            itemCom.left = (temWidth - itemCom.width) / 2;
          }
          if (temHeight < itemCom.height) {
            itemCom.height = temHeight;
            itemCom.top = 0;
          } else {
            itemCom.top = (temHeight - itemCom.height) / 2;
          }
        }
      } else {
        this.enum_ = {
          presetText: {
            height: 24,
            fontSize: 18,
            width: 135,
            top: 409,
            left: 230
          },
          textComponent: {
            height: 24,
            fontSize: 18,
            width: 112,
            top: 409,
            left: 241
          },
          presetImg: {
            height: 200,
            fontSize: 14,
            width: 355,
            top: 320,
            left: 120
          },
          imgComponent: {
            height: 200,
            fontSize: 14,
            width: 355,
            top: 320,
            left: 120
          },
          qrcode: { height: 71, fontSize: 14, width: 71, top: 346, left: 222 }
          // presetMedia: { height: 200, fontSize: 14, width: 355 },
          // mediaComponent: { height: 200, fontSize: 14, width: 355 }
        };
      }

      this.certificateImage = this.navigationForm.bgImg;
      this.setNavigationSync = false;

      this.$nextTick(() => {

        this.setTmpItem("e", "qrcode");
      });
    },
    // 设置导航组件
    setNavigation() {
      // 如果已经有导航了，说明showNavigation为true,再次点击的时候就变成添加icon

      this.setNavigationSync = true;
    },

    getAttrRect(rect) {
      //组件激活以后,设置"组件设置"的所有属性

      this.comWidth = rect.width;
      this.comHeight = rect.height;
      this.comX = rect.left;
      this.comY = rect.top;

      if (rect.type == "presetText" || rect.type == "textComponent") {
        // fontColor fontSize width height fontFamily textAlign verticalAlign //rect的属性

        this.comfontFamily = !!rect.fontFamily ? rect.fontFamily : "Arial";
        this.comfontWeight = rect.fontWeight || false;
        this.combackgroundColor = rect.backgroundColor || "rgba(255,255,255,0)";
        this.labelFontsize = !!rect.fontSize ? rect.fontSize : "14"; //字号
        this.labelcolor = !!rect.fontColor ? rect.fontColor : "#848484"; //字体颜色
        this.textAlign = !!rect.textAlign ? rect.textAlign : "center";
        this.verticalAlign = !!rect.verticalAlign
          ? rect.verticalAlign
          : "middle";
      }
    },
    // 异步加载编辑人
    loadNode_(node, resolve) {
      let id = null;
      if (node.level >= 1) {
        id = node.data.id;
      }

      this.getSysUserAuthList_(id, resolve, node.checked || node.disabled);
    },

    handleAvatarSuccess(res, file) {
      if (res.code != 200) {
        this.$message({ message: "上传错误", type: "error" });
        return;
      }
      this.navigationForm.bgImg = res.data; // URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isJPG =
        testmsg === "jpg" ||
        testmsg === "JPG" ||
        testmsg === "png" ||
        testmsg === "PNG";

      // const isLt2M = file.size / 1024 / 1024 <= 1;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
      }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 1M!");
      // }
      return isJPG;
    },
    recursionUp(item, fn, level) {
      let isAcount = fn(item);
      if (!isAcount) {
        return item;
      } else {
        if (level >= 10) {
          return false;
        }
        if (isAcount.tagName == "BODY" || isAcount.tagName == "HTML") {
          return false;
        }
        level++;

        return this.recursionUp(isAcount, fn, level);
      }
    },
    listenKeyDown(e) {
     
      //此处不能添加事件阻止方法，会影响到组件的复制
      // e.stopPropagation(); //非IE浏览器
      //         e.preventDefault(); //非IE浏览器

      //如果是编辑文本，则返回
      if (e.target.getAttribute("data-event-dbclick") == "dbclick_noCopy") {
        return;
      }
      let key = window.event.keyCode;
      //删除
      if (key == 46 || key == 8) {
        if (!this.$store.getters["getAllActive"]) {
          return false;
        }
        if( e.target.tagName!='BODY'){
          return 
        }
        try {
          e.stopPropagation(); //非IE浏览器
          e.preventDefault(); //非IE浏览器
        } catch (e) {
          window.event.cancelBubble = true; //IE浏览器
          window.event.returnValue = false;
        }
        // haveNoactive 的值取决于 第二个参数
        let haveNoactive = this.recursionUp(
          e.target,
          value => {
            if (
              (value.nodeName != "HTML" &&
                value.nodeName != "BODY" &&
                value.nodeName != "html" &&
                value.nodeName != "body") ||
              value.getAttribute("data") == "noactive" ||
              value.className.indexOf("noactive") >= 0
            ) {
              return false;
            } else {
              if (
                value.nodeName == "#document" ||
                value.nodeName == "HTML" ||
                value.nodeName == "BODY"
              ) {
                return value;
              } else {
                return value.parentNode;
              }
            }
          },
          0
        );

        if (!haveNoactive) {
          this.deleterct();
        }
        return false;
      }
      if (e.ctrlKey) {
        //ctr+c ctr+v
        //撤销
        if (key == 90) {
          this.getlastStep();
        }
        if (e.key == "v") {
          this.virtualCom(true);
          if (e.target.getAttribute("data-event-dbclick") == "dbclick_noCopy") {
            return;
          }
          //黏贴组件
          if (Object.keys(this.ctrlC).length < 1) {
            return;
          }
          this.$store.dispatch("dragLesize/ctrVRects", this.ctrlC);
          this.$message({ message: "组件已粘贴", type: "success" });
        }

        if (!this.$store.getters["getAllActive"]) {
          return false;
        }
        if (e.key == "c") {
          //复制组件
          if (e.target.getAttribute("data-event-dbclick") == "dbclick_noCopy") {
            return;
          }
          let activeArr = !this.$store.getters["getAllActive"]
            ? []
            : this.$store.getters["getAllActive"];
          if (activeArr.length < 1) {
            return;
          }
          let hasQrcode = activeArr.filter(item => item.type == "qrcode");
          if (hasQrcode.length > 0) {
            this.$message({
              message: "不能复制二维码组件，请重新复制",
              type: "error"
            });
            return;
          }
          this.ctrlC = this.$store.getters["getAllActive"];
          this.$message({ message: "组件已复制", type: "success" });
        }
      }
      //编辑文本组件
      if (
        e.target.getAttribute("data-event-click") &&
        e.target.getAttribute("data-event-click") == "editContent"
      ) {
        return;
      }
      if (key == 37 || key == 38 || key == 39 || key == 40) {
          if( e.target.tagName!='BODY'){
            return 
          }
        if (!!this.$store.getters["getAllActive"]) {
          this.virtualCom(true);
          //
          try {
            e.stopPropagation(); //非IE浏览器
            e.preventDefault(); //非IE浏览器
          } catch (e) {
            window.event.cancelBubble = true; //IE浏览器
            window.event.returnValue = false;
          }
          // let item = this.$store.state.dragLesize.rects[
          //   this.$store.getters["getActive"]
          // ];
          let activeArr = this.$store.getters.getAllActive;
          activeArr = !activeArr ? [] : activeArr;
          activeArr.map(item => {
            let type = "left",
              value = item.left;
            if (key == 37) {
              //left
              type = "left";
              value = item.left - 1;
            }
            if (key == 38) {
              //up
              type = "top";
              value = item.top - 1;
            }
            if (key == 39) {
              //right
              type = "left";
              value = item.left + 1;
            }
            if (key == 40) {
              //down
              type = "top";
              value = item.top + 1;
            }

            this.$store.dispatch("dragLesize/setComAttr", {
              key: item.key, //type 为textComponent,attr为text的时候，设置placeholder
              attr: type,
              value: value
            });
          });
        }
      }
    },
    listenKeyup(e) {
      if (e.target.tagName == "INPUT") {
        return false;
      }
      let key = window.event.keyCode;
      if (key == 46 || key == 8) {
        if (!this.$store.getters["getAllActive"]) {
          return false;
        }
        try {
          e.stopPropagation(); //非IE浏览器
          e.preventDefault(); //非IE浏览器
        } catch (e) {
          window.event.cancelBubble = true; //IE浏览器
          window.event.returnValue = false;
        }
       }
      this.virtualCom(false);
    },
    setComLockState() {
      this.setComLock = !this.setComLock;
    },

    //文本组件设置placeholder
    setPlaceHolder(item, value) {
      //  shawn
      let sha256String = sha256(value);
      //编辑
      this.$store.dispatch("dragLesize/setComAttr", {
        key: item.key, //type 为textComponent,attr为text的时候，设置placeholder
        attr: "text",
        value: value
      });
      this.$store.dispatch("dragLesize/setComAttr", {
        key: item.key,
        attr: "sha256",
        value: sha256String
      });
      // 添加操作记录
      setTimeout(() => {
        this.lastStepCallback = false;
        this.preStep(this.$store.state.dragLesize.rects, this.active);
      }, 500);
    },
    editcontent(item) {
      if (item.type == "textComponent") {
        this.form.name = item.placeholder;
      } else {
        this.form.name = item.text;
      }
      this.editComid = item.key;
      this.title_ = item.type == "textComponent" ? 3 : 2;
      this.presetTextSync = true;
    },
    textAlignChange(e, v) {
      if (!this.isSettingDisabled.align) {
        return;
      }

      this.$store.dispatch("dragLesize/setComAttr", {
        key: this.$store.state.dragLesize.rects[
          this.$store.getters["getActive"]
        ].key,
        attr: "textAlign",
        value: v
      });
    },
    verticalAlignChange(e, v) {
      if (!this.isSettingDisabled.align) {
        return;
      }
      this.$store.dispatch("dragLesize/setComAttr", {
        key: this.$store.state.dragLesize.rects[
          this.$store.getters["getActive"]
        ].key,
        attr: "verticalAlign",
        value: v
      });
    },
    comfontFamilyChange(v) {
      this.$store.dispatch("dragLesize/setComAttr", {
        key: this.$store.state.dragLesize.rects[
          this.$store.getters["getActive"]
        ].key,
        attr: "fontFamily",
        value: v
      });
    },
    setFontWeight(v) {
      this.$store.dispatch("dragLesize/setComAttr", {
        key: this.$store.state.dragLesize.rects[
          this.$store.getters["getActive"]
        ].key,
        attr: "fontWeight",
        value: !this.comfontWeight
      });
    },
    setBackgroundColor(v) {
      this.$store.dispatch("dragLesize/setComAttr", {
        key: this.$store.state.dragLesize.rects[
          this.$store.getters["getActive"]
        ].key,
        attr: "backgroundColor",
        value: this.combackgroundColor
      });
    },
    setXY(event, comref) {
      let attr = comref == "X" ? "left" : "top";
      let activeArr = !this.$store.getters.getAllActive
        ? []
        : this.$store.getters.getAllActive;
      // { rect: this.rect,key:this.parentKey_mo, type: "dragstop" }
      let rect = {};
      if (activeArr.length > 1) {
        let cha = Number(event.target.value) - this.multipleCom[attr];
        let chaObj =
          attr == "left"
            ? { left: this.multipleCom.left + cha }
            : { top: this.multipleCom.top + cha };

        this.multipleCom = Object.assign({}, this.multipleCom, chaObj); //设置虚拟框的位置

        activeArr.map(item => {
          this.$store.dispatch("dragLesize/setComAttr", {
            key: item.key,
            attr: attr,
            value: attr == "left" ? item.left + cha : item.top + cha
          });
          return item;
        });
      } else {
        activeArr.map(item => {
          this.$store.dispatch("dragLesize/setComAttr", {
            key: item.key,
            attr: attr,
            value: Number(event.target.value)
          });
          return item;
        });
      }
    },
    valiteXY(event, comref) {
      // typeof event.target.value返回的是string ,但是可以比较
      if (event && event.key == ".") {
        event.target.value = event.target.value.substr(
          0,
          event.target.value.length - 1
        );
      }
      if (isNaN(Number(event.target.value))) {
        event.target.value = "";
        return;
      }

      // event.target.value<=0?event.target.value=0:''
      let activeArr = !this.$store.getters.getAllActive
        ? []
        : this.$store.getters.getAllActive;
      if (activeArr.length <= 0) {
        return;
      }
      let distance = 0; //获取最大距离
      let attr = comref == "X" ? "left" : "top";

      // 设置x
      if (attr == "left") {
        if (activeArr.length == 1) {
          distance = parseInt(this.templateForm.width) - activeArr[0].width;
        } else {
          distance = parseInt(this.templateForm.width) - this.multipleCom.width;
        }
      } else {
        //设置Y
        // parentH
        if (activeArr.length == 1) {
          distance = parseInt(this.templateForm.height) - activeArr[0].height;
        } else {
          distance =
            parseInt(this.templateForm.height) - this.multipleCom.height;
        }
      }
      // 设置数据
      event.target.value >= distance
        ? (event.target.value = distance)
        : event.target.value;
      this.throttleXY(event, comref);

      // throttle()
    },
    setXYBlurFocus(comref, type) {
      if (this.isShowMultipleCom) {
        if (!type) {
          this.virtualCom(false);
          this["comX"] = 0;
          this["comY"] = 0;
        }
      } else {
        this.virtualCom(true, result => {
          this["comX"] = this.multipleCom.left;
          this["comY"] = this.multipleCom.top;
        });
      }
    },
    comXYBlur(event, comref) {
      this.debounceXYBlur(comref, false);
    },
    comXYfocus(event, comref) {
      let activeArr = !this.$store.getters.getAllActive
        ? []
        : this.$store.getters.getAllActive;
      if (activeArr.length > 1) {
        this.debounceXYBlur(comref, true);
      }
    },
    comXYChange(value, comref) {
      return;
      let attr = comref == "X" ? "left" : "top";
      let activeArr = !this.$store.getters.getAllActive
        ? []
        : this.$store.getters.getAllActive;

      activeArr.map(item => {
        this.$store.dispatch("dragLesize/setComAttr", {
          key: item.key,
          attr: attr,
          value: Number(value)
        });
        return item;
      });
    },
    valiteWH(event, comref) {
      if (event && event.key == ".") {
        event.target.value = event.target.value.substr(
          0,
          event.target.value.length - 1
        );
      }
      if (isNaN(Number(event.target.value))) {
        event.target.value = "";
        return;
      }

      let rectItem = this.$store.state.dragLesize.rects[this.recordActiveRects];
      let value = Number(event.target.value);
      if (comref == "widthInputnumber") {
        if (value < 10) {
          if (this.time != null) {
            clearTimeout(this.time);
            this.time = null;
          }
          this.time = setTimeout(() => {
            event.target.value = 10;
             this.comWidthHeightChange(event.target.value,comref)
          }, 1500);
        } else {
          clearTimeout(this.time);
          this.time = null;
          if (rectItem.left + value >= Number(this.templateForm.width)) {
            event.target.value =
              Number(this.templateForm.width) - rectItem.left;
          }
          this.comWidthHeightChange(event.target.value,comref)
        }
      } else {
        if (value < 10) {
          if (this.time != null) {
            clearTimeout(this.time);
            this.time = null;
          }
          this.time = setTimeout(() => {
            event.target.value = 10;
            this.comWidthHeightChange(event.target.value,comref)
          }, 1500);
        } else {
          clearTimeout(this.time);
          this.time = null;
          if (rectItem.top + value >= Number(this.templateForm.height)) {
            event.target.value =
              Number(this.templateForm.height) - rectItem.top;
          }else{
            event.target.value = value;
          }
          
          this.comWidthHeightChange(event.target.value,comref)
        }
      }
    },
    comWidthHeightChange(v, comref) {
      if (!v) {
        return;
      }
      if (!this.recordActiveRects && this.recordActiveRects !== 0) {
        return;
      }

      let attrV = comref == "widthInputnumber" ? "width" : "height",
        Obj = {};
      if (this.setComLock) {
        let rectItem = this.$store.state.dragLesize.rects[
          this.recordActiveRects
        ];
        let arx = Math.round((rectItem.width / rectItem.height) * 1000) / 1000;

        if (attrV == "width") {
          // if(rectItem.left+Number(v)>375){
          //   v=375-rectItem.left
          // }
          // this.comWidth=375
          //  this.comHeight =Math.round(Number(v) / arx)
          Obj.height = this.comHeight;

        } else {
          this.comWidth = Math.round(
            Number(v) * arx,
            Number(v) / arx,
            this.comHeight
          );
          Obj.width = this.comWidth;
        }
        Obj.aspectFactor = arx;
      }

      Obj[attrV] = Number(v);
      this.$store.dispatch("dragLesize/setComAttr", {
        key: this.$store.state.dragLesize.rects[this.recordActiveRects].key,
        attr: "multiple",
        value: Obj
      }); //设置组件
      // this.$store.dispatch("dragLesize/setComAttr", {
      //   key: this.$store.state.dragLesize.rects[this.recordActiveRects].key,
      //   attr: attrV,
      //   value: Number(v)
      // }); //设置组件
      if (!this.$store.getters.getActive) {
        //所有组件都是去激活状态就立刻清除否则保留
        this.recordActiveRects = null;
      }
    },
    dragstop(data) {
      setTimeout(() => {
        this.lastStepCallback = false;
        this.preStep(this.$store.state.dragLesize.rects, this.active);
      }, 10);
    },
    resizestop() {
      //
      setTimeout(() => {
        this.lastStepCallback = false;
        this.preStep(this.$store.state.dragLesize.rects, this.active);
      }, 10);
    },
    preStep(value, activePage) {
      let moduleIndex = null;

      let arr = localStorage.getItem("rects_");
      if (arr) {
        let obj = JSON.parse(arr);
        let string_ = {};
        if (obj.length <= 1) {
          string_ = { rects: value, page: activePage };
          obj.push(string_);
          localStorage.setItem("rects_", JSON.stringify(obj));
        } else {
          obj.splice(0, 1);
          string_ = { rects: value, page: activePage };
          obj.push(string_);

          localStorage.setItem("rects_", JSON.stringify(obj));
        }
      } else {
        localStorage.setItem(
          "rects_",
          JSON.stringify([{ rects: value, page: activePage }])
        );
      }
    },
    getlastStep() {
      if (this.lastStepCallback) {
        return;
      }
      let arr = localStorage.getItem("rects_");
      if (arr) {
        let obj = JSON.parse(arr);
        if (obj.length > 1) {
          let lastStepRect = obj.splice(0, 1);

          this.$store.dispatch("dragLesize/setComAttr", {
            key: "",
            attr: "lastStep",
            value: lastStepRect[0]
          }); //设置组件

          // localStorage.removeItem('arr');

          localStorage.setItem("rects_", JSON.stringify(lastStepRect));
          this.lastStepCallback = true;
        }
      }
    },
    setPresetImg(data, img, sha256) {
      this.lastStepCallback = false;
      this.$store.dispatch("dragLesize/setComAttr", {
        key: data.key,
        value: img,
        attr: "text"
      });
      this.$store.dispatch("dragLesize/setComAttr", {
        key: data.key,
        value: sha256,
        attr: "sha256"
      });
    },

    getRefLineParams(params) {
      const { vLine, hLine } = params;
      this.vLine = vLine;
      this.hLine = hLine;
    },

    callbackCertificate(e) {
      if (this.edited) {
        let attr = "error";
        let img = require("src/assets/img/errorTip.png");
        this.$confirm(
          '<div style="width:100%;text-align:center;"><img style="width:4.5rem;hieght:4.4rem;" src="' +
            img +
            '"/></div><div style="width:100%;text-align:center;font-size:0.8rem;">有未保存内容，退出后无法恢复，是否确认退出？</div>',
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
            dangerouslyUseHTMLString: true
            // type: 'warning'
          }
        )
          .then(() => {
            this.$router.push({ path: "templateManagement" });
          })
          .catch(() => {});
      } else {
        this.$router.push({ path: "templateManagement" });
      }
    },
    handleClose(e){
    this.previewSave=false;
  },
    precivewCertifi(type) {
      if(!!type && type=='save'){
        this.previewSave = true
      } 
      this.previewCertificate = true;
    },
    beforeUpload(file) {
      this.edited = true;
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },

    handlePreview(file) {
    },

    hasnoactive(el, index) {
      if (
        el.getAttribute("data") == "noactive" ||
        el.className.indexOf("noactive") >= 0
      ) {
        return true;
      } else {
        if (index > 7 || !el.parentElement) {
          return false;
        } else {
          return this.hasnoactive(el.parentElement, index + 1);
        }
      }
    },

    resetParentHeight() {

      var arr = this.$store.state.dragLesize.rects;
      var max =
        arr.length > 0
          ? arr.reduce(function(a, b) {
              let amax = a.height + a.top;
              let bmax = b.height + b.top;
              return bmax > amax ? b : a;
            })
          : { height: 667, top: 0 };
      if (max.height + max.top < 804) {
        this.phoneboxHieght = 804;
      } else {
        this.phoneboxHieght = max.height + max.top + 30;
      }
    },
    // 设置颜色
    labelcolor_reset(v) {
      this.edited = true;
      if (this.saveActive == null) {
        this.$message.error("请选择组件");
        return false;
      }

      // if (this.$store.state.dragLesize.rects[this.saveActive].type != "presetText" && this.$store.state.dragLesize.rects[this.saveActive].type != "title" ) {
      //   this.$message.error('只能对证书标题和模板文案设置字体颜色');
      //   return false;
      // }

      this.$store.dispatch("dragLesize/resetFontcolor_rect", {
        index: this.saveActive,
        color: v
      });
    },
    // 设置组件背景颜色
    backgroundColor_reset(v) {
      if (this.$store.getters["getActive"] == null) {
        this.$message.error("请选择组件");
        return false;
      }
      if (
        this.$store.state.dragLesize.rects[this.$store.getters["getActive"]]
          .type != "presetText" &&
        this.$store.state.dragLesize.rects[this.$store.getters["getActive"]]
          .type != "textComponent" &&
        this.$store.state.dragLesize.rects[this.$store.getters["getActive"]]
          .type != "title"
      ) {
        this.$message.error("只能对预置文本和文本组件设置背景颜色");
        return false;
      }

      this.$store.dispatch("dragLesize/setComAttr", {
        key: this.$store.state.dragLesize.rects[
          this.$store.getters["getActive"]
        ].key,
        attr: "backgroundColor",
        value: v
      });
    },
    //设置字体
    labelSize_reset(v) {
      this.edited = true;
      if (this.saveActive == null) {
        this.$message.error("请选择组件");
        return false;
      }
      // if (this.$store.state.dragLesize.rects[this.saveActive].type != "presetText"  && this.$store.state.dragLesize.rects[this.saveActive].type != "title" ) {
      //   this.$message.error('只能对证书标题和模板文案设置字体大小');
      //   return false;
      // }

      this.$store.dispatch("dragLesize/resetFontsize_rect", {
        index: this.saveActive,
        size: v
      });
      // setTimeout(() => {
      //   this.labelFontsize='14';
      // }, 100);
    },
    setZindex(e, type) {
      if (!this.$store.getters["getAllActive"]) {
        //获取最后一个选中的组件或者单选的组件
        this.$message.error("请选择组件");
        return false;
      }
      if (type == "qrcode") {
        return;
      }
      this.$store.dispatch("dragLesize/setZindex", { type: type });
    },
    //删除组件
    deleterct() {
      if (this.$store.getters["getActive"] == null) {
        this.$message.error("请选择组件");
        return false;
      }
      let actArr = this.$store.getters.getAllActive;
      let qrRect = actArr.find(obj => obj.type == "qrcode");

      if (qrRect) {
        this.$message.error("不能删除二维码组件");
        return false;
      }

      let img = require("src/assets/img/deleteTwo.png");
      this.$confirm(
        '<div style="width:100%;text-align:center;"><img style="width:4.5rem;hieght:4.4rem;" src="' +
          img +
          '"/></div><div style="width:100%;text-align:center;font-size:0.8rem;">此操作将永久删除该组件, 是否继续?</div>',
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          customClass: "noactive"
          // type: 'warning'
        }
      )
        .then(() => {
          this.$store.dispatch("dragLesize/delete_rect", {
            key: actArr.map(item => {
              return item.key;
            }),
            page: this.active
          });

          setTimeout(() => {
            this.lastStepCallback = false;
            this.preStep(this.$store.state.dragLesize.rects, this.active);
          }, 10);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加组件
    setTmpItem(e, type) {
      // if (type == "presetText" ) {

      //     this.title_ = 2;
      //     this.widthVlible = "133px";

      //   this.presetTextSync = true;
      // } else {

      let params = {
        data: type,
        enum_: this.enum_
        // page: this.active
      };
      if (type == "presetText") {
        params.text = "";
        this.title_ = 2;
        this.widthVlible = "133px";
      }
      if (type == "textComponent") {
        this.title_ = 3;
      }
      if (type == "qrcode") {
        let haveQrcodeCom = this.rects.filter(item => item.type == "qrcode");
        if (haveQrcodeCom.length >= 1) {
          // this.$message({ message: "只能添加1个二维码", type: "error" });
          return;
        }
      }

      this.lastStepCallback = false;

      if (type == "qrcode") {
        this.$store.dispatch("dragLesize/addRects", {
          data: type,
          obj: {
            width: this.templateForm.width,
            height: this.templateForm.height
          },
          enum_: this.enum_
        });
        // this.$message({ message: "二维码添加成功", type: "success" });
      } else {
        this.$store.dispatch("dragLesize/addRects", params);
      }
      // }
      setTimeout(() => {
        this.lastStepCallback = false;
        this.preStep(this.$store.state.dragLesize.rects, this.active);
      }, 500);
    },
    // 设置组件激活状态
    activateEv(index, isCtr) {
      this.recordActiveRects = index;
      let func = !!isCtr
        ? "dragLesize/setActiveMultiple"
        : "dragLesize/setActive";
      this.$store.dispatch(func, {
        id: index,
        page: this.active
      });
    },
    // 设置组件去激活状态
    deactivateEv(index) {
      this.$store.dispatch("dragLesize/unsetActive", { id: index });
    },
    changePosition(event, index) {
      let newRect = event.rect;
      let activeArr = this.$store.getters["getAllActive"];
      activeArr = !activeArr ? [] : activeArr;

      if (activeArr.length > 1) {
        let oldCom = activeArr.filter(item => item.key == event.key);

        oldCom = oldCom[0];
        let option = {};
        for (let k in newRect) {
          option[k] = newRect[k] - oldCom[k];
        }

        this.multipleCom = Object.assign({}, this.multipleCom, {
          top: this.multipleCom.top + option.top,
          left: this.multipleCom.left + option.left
        }); //设置虚拟框的位置

        activeArr.map(item => {
          this.$store.dispatch("dragLesize/setComAttr", {
            key: item.key,
            attr: "multiple",
            value: { top: item.top + option.top, left: item.left + option.left }
          });
          return item;
        });
      } else {
        this.saveActive = this.$store.getters["getActive"];
        this.$store.dispatch("dragLesize/setTop", {
          id: index,
          top: newRect.top
        });
        this.$store.dispatch("dragLesize/setLeft", {
          id: index,
          left: newRect.left
        });
        this.$store.dispatch("dragLesize/setWidth", {
          id: index,
          width: newRect.width
        });
        this.$store.dispatch("dragLesize/setHeight", {
          id: index,
          height: newRect.height
        });
      }

      this.resetParentHeight();
      setTimeout(() => {
        this.lastStepCallback = false;
        this.preStep(this.$store.state.dragLesize.rects, this.active);
      }, 10);
    },
    resetResizable(status, item) {
      this.$store.dispatch("dragLesize/setComAttr", {
        key: item.key,
        attr: "resizable",
        value: status
      });
    },
    resetHeight(newheight, item) {
      this.$store.dispatch("dragLesize/setComAttr", {
        key: item.key,
        attr: "height",
        value: newheight
      });
    },
    //改变大小以后设置组件
    changeSize(e, index) {
      
      let newRect = e.rect,
        type = e.type,
        width_ = e.width,
        height_ = e.height;
      let item_ = this.$store.state.dragLesize.rects[index];
      if (item_.type == "qrcode") {
        

        if (
          (width_ <= 71 || height_ <= 71) &&
          !this.timerForMessage &&
          type == "resizingStop"
        ) {
          this.timerForMessage = true;

          this.$message({
            message: "二维码的最小宽高为71*71",
            type: "error"
          });
          setTimeout(() => {
            this.timerForMessage = false;
          }, 3000);
        }
        let oldQrcode = this.rects.find(item=>item.type=='qrcode');
        console.log('oldqrd=code',oldQrcode);
 
        let remainder = newRect.width%69
        let multiple = Math.floor(newRect.width/69)
        let maxX = newRect.width+newRect.left;
        let maxY = newRect.height+newRect.top;
        if(remainder> Math.floor(69/2)){
          multiple= multiple+1
        }
        newRect.width=69*multiple+2
        newRect.height=69*multiple+2
         switch (
            e.currentStick[0] 
          ) {
            case "b":
              newRect.top=newRect.top
              break;
            case "t":
            newRect.top=maxY-newRect.height
              break;
          }

          switch (
            e.currentStick[1] //算出left值
          ) {
            case "r":
              newRect.left=newRect.left
              break;

            case "l":
              newRect.left = maxX-newRect.width;
              break;
          }
       
      
        if(newRect.width+newRect.left>this.templateForm.width){
          newRect.left=Number(this.templateForm.width)-newRect.width
        }
        if(newRect.height+newRect.top>this.templateForm.height){
          newRect.top=Number(this.templateForm.height)-newRect.height
        }
        // console.log('newqrcode',newRect);
         let keyarr = oldQrcode.key.split('_');
         keyarr[keyarr.length-1]=new Date().getTime()
         let newkey = keyarr.join('_')
         this.$store.dispatch("dragLesize/setComAttr", {
            key: oldQrcode.key,
            attr: "multiple",
            value: Object.assign({},newRect,{key:newkey})
          }); //设置组件
        this.$forceUpdate();
         return 
      }
  
      this.$store.dispatch("dragLesize/setTop", {
        id: index,
        top: newRect.top
      });
      this.$store.dispatch("dragLesize/setLeft", {
        id: index,
        left: newRect.left
      });
      this.$store.dispatch("dragLesize/setWidth", {
        id: index,
        width: newRect.width
      });
      this.$store.dispatch("dragLesize/setHeight", {
        id: index,
        height: newRect.height
      });
      this.resetParentHeight();
    },

    // 是否未编辑
    toIsEdit() {
      this.isEdit = true;
    },
    // 提交数据
    async submitForm(e, formName, eventData) {
      e.target.blur();
      let hasNoEdit = this.rects.filter(item => {
        return (
          (item.type == "presetImg" || item.type == "presetText") &&
          item.text == ""
        );
      });

      if (hasNoEdit.length > 0) {
        this.$message({
          message: "您有未设置的预置组件，请先设置组件",
          type: "error"
        });
        return false;
      }
      var that = this;
      if (this.dynamicValidateForm.tmpname.length == 0) {
        this.$message({ message: "请添加模板名称", type: "error" });
        return false;
      }
      // if (this.bgImg.length < 1) {
      //   this.$message({ message: "请添加模板背景图", type: "error" });
      //   return false;
      // }
      let params = {
        id: this.dynamicValidateForm.id,
        name: this.dynamicValidateForm.tmpname,
        sysUserEditIds: [].concat(...this.sysUserIds).map(item => {
          return item.id;
        }), //企业组织机构,	//是	Long[]	模版编辑人权限（成员）
        sysUserEditAuthIds: [].concat(...this.sysUserAuthIds).map(item => {
          return item.id;
        }), //	是	Long[]	模版编辑人权限（组织架构）
        sysUserUseIds: [].concat(...this.companyIds).map(item => {
          return item.id;
        }), //	是	Long[]	模版使用权限（成员）
        sysUserUseAuthIds: [].concat(...this.companyAuthIds).map(item => {
          return item.id;
        }) //	是	Long[]	模版使用权限（组织架构）
      };
      let data_ = new algorithm(this.rects);

      let dataSort = data_.sort;
      // 将所有宽高，top ,left ,zindex 转为数字
      let rectsArr = this.rects.map(item => {
        item.top = Number(item.top);
        item.left = Number(item.left);
        item.width = Number(item.width);
        item.height = Number(item.height);
        item.zIndex = Number(item.zIndex);
        item.fontSize = Number(item.fontSize);
        return item;
      });
      params.content = JSON.stringify({
        data: {
          templateWidth: Number(this.navigationForm.width),
          templateHeight: Number(this.navigationForm.height),
          // appData: dataSort,
          content: rectsArr,
          backgroundColor: this.navigationForm.bgColor,
          backgroundImg: this.navigationForm.bgImg
        },
        code: 200,
        msg: "json数据"
      });
      //  返回id
      let result;
      //  companyIds: [], //	是	Long数组	企业Id列表
      // companyAuthIds: [], //	是	Long 数组	企业组织id（使用权限）
      // sysUserIds: [], //	是	Long 数组	成员ID列表
      // sysUserAuthIds: [], //	是	Long 数组	成员组织id（模版编辑权限）

      let response = await templateAddOrUpdate(params);

      if (!!response) {
        this.dynamicValidateForm.id = response;
        this.$parent.getUserInfo();
        this.$message({ message: "模板保存成功", type: "success" });
        this.$router.push({ path: "templateManagement" });

        //this.$store.dispatch('dragLesize/get_rects', { url: !!aa.content ? aa.content : null })
        // this.$nextTick(() => {
        //   this.resetParentHeight();
        // })
      }
      e.preventDefault();
      e.stopPropagation();
    },
    handleSelect(item, field) {
      this.$refs.dynamicValidateForm.validateField(field);
    }
  },
  beforeDestroy: function() {
    document.documentElement.removeEventListener("keyup", this.listenKeyup);
    document.documentElement.removeEventListener("keydown", this.listenKeyDown);
  }
};
</script>
<style lang="scss" scoped>
@import "./templatAdd";
@import "~assets/css/mixin";
</style>
<style>
.itemCom .el-input--suffix .el-input__inner{
  padding-right:15px;
  padding-left:10px;
}
.filler_ {
  background: rgba(11, 204, 43, 0.1);
  border: 1px solid black;
}
/* 组件设置 */
/* x y w h */
.setAfter {
  display: inline-block;
  text-align: center;
  width: 0.8rem;
  line-height: 2rem;
  font-size: 0.7rem;
}
#rose-layout .input_ .is-without-controls .el-input {
  width: 100%;
}
.preView .el-dialog__header,
.preView .el-dialog__body {
  padding-left: 20px !important;
  padding-right: 20px !important;
}
.preView .el-dialog__body {
  padding-bottom: 30px !important;
}
.preView .phone-set::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: rgba(0, 255, 255, 0);
}

.preView .phone-set:hover::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: rgba(255, 255, 255, 0);
}

/*定义滚动条轨道 内阴影+圆角*/
.preView .phone-set::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 255, 255, 0);
  border-radius: 10%;
  background-color: rgba(255, 255, 255, 0);
}

/*定义滚动条轨道 内阴影+圆角*/
.preView .phone-set::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 255, 255, 0);
  border-radius: 10%;
  background-color: rgba(255, 255, 255, 0);
}

/*定义滑块 内阴影+圆角*/
.preView .phone-set::-webkit-scrollbar-thumb {
  border-radius: 10%;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
  background-color: rgba(0, 0, 0, 0.4);
}
.navDialog .el-button {
  padding: 0.6rem 1rem;
  font-size: 0.7rem;
}
#templateAdd .navDialog .el-input {
  width: 280px;
}
#templateAdd .itemCom .el-select,
#templateAdd .itemCom .el-input__inner {
  height: 40px !important;
  line-height: 40px !important;
}
#templateAdd .itemCom .el-input .el-input__icon {
  line-height: 40px;
}
#templateAdd #setComItem .el-select > .el-input {
  height: 40px !important;
}
#templateAdd #setComItem .fontOther .fontFamily_ .el-select {
  width: 150px;
}
#templateAdd #setComItem .fontWeight {
  height: 40px !important;
  width: 40px !important;
}
#templateAdd #setComItem .fontWeight .fontWeight_img {
  height: 40px;
  width: 40px;
  background: url("../../assets/img/fontweight_.png") no-repeat 100%/100%;
}
#templateAdd #setComItem .fontWeight .activeFW,
#templateAdd #setComItem .fontWeight .fontWeight_img:hover {
  background: url("../../assets/img/fontweight.png") no-repeat 100%/100%;
}
.navigation .el-color-picker__trigger {
  width: 14rem;
  height: 2rem;
}
.setColorM .el-color-picker__mask {
  width: 96%;
  /* height: 2rem; */
}
.box_ {
  display: flex;
  justify-content: start;
  flex-direction: row;
}
.box_ > div {
  padding: 0px 20px;
  border: 1px solid #dedede;
  border-radius: 10%;
  margin: 10px 10px 10px 0px;
  position: relative;
}
.box_ .box_close {
  position: absolute;
  right: 0px;
  top: 0px;
  color: red;
  display: none;
  cursor: pointer;
}

.box_ > div:hover {
  background-color: cornsilk;
}
.box_ > div:hover .box_close {
  display: block;
}
.el-message-box__btns {
  text-align: center;
}

.uploadtab .el-upload--picture-card {
  width: 24px !important;
  height: 24px !important;
  background: url(~assets/img/defaultImg.png);
  background-size: 100%;
}

.uploadtab .el-upload--picture-card i {
  font-size: 10px;
}

.filler {
  width: 100%;
  height: 100%;
  display: inline-block;
  border: 1px dashed #35c55b;
  position: relative;
  /* background-color: #fff; */
}

.moduletitle .el-input__inner {
  border-radius: 0px;
  border: 0px;
  border-bottom: 1px solid #dcdfe6;
}

.setphoneItem_ > div {
  margin-right: 0.5rem;
}

.labelcolor_,
.labelcolor_ .el-color-picker__trigger {
  height: 2rem;
  width: 2rem;
}

.el-select {
  height: 2rem;
  line-height: 2rem;
}

.uploadClass {
  height: 24px;
}

.uploadClass .el-upload-list--picture-card .el-upload-list__item {
  width: 24px;
  height: 24px;
  margin: 0 !important;
}

.uploadClass .el-upload-list--picture-card .el-progress {
  display: none;
}

.uploadClass
  .el-upload-list__item.is-success
  .el-upload-list__item-status-label,
.uploadClass .el-upload-list--picture-card .el-upload-list__item-actions span {
  display: none !important;
}

.deleteCom {
  cursor: pointer;
  background: url("~assets/img/deleteOne.png") no-repeat;
  height: 1.6rem;
  width: 1.6rem;
  background-size: 100%;
}
.laststepCom {
  cursor: pointer;
  background: url("~assets/img/chexiao.png") no-repeat;
  height: 1.6rem;
  width: 1.6rem;
  background-size: 100% 100%;
}
/* .phone-set-box .vdr{
    position:relative !important;
  } */
.phone-set-box:hover {
  /* padding:0px 15px 0px 0px !important; */
}
.phone-set-box1 {
  background-size: 100% 100%;
}
#ruler {
  position: absolute;
  visibility: hidden;
  white-space: pre-wrap;
  top: 150px;
  /* z-index: -100; */
  font-size: 18px;
  font-family: "inherit";
  line-height: 18px;
  word-break: break-all;

  /* border: 1px dashed #dedede; */
  min-height: 40px;
  box-sizing: border-box;
}


.el-edit-cen .el-form-item__content {
  width: 100%;
  float: right;
}
.labelcolor_ {
  width: 60px;
}
.fontColorIcon {
  vertical-align: middle;
  display: inline-block;
  width: 43px;
  height: 40px;

  background: url("~assets/img/zifu.png") no-repeat;
  background-size: 100% 100%;
}
#rose-layout #templateAdd .temname .el-input {
  width: 27rem;
}
#rose-layout #templateAdd .temname_ .el-input {
  width: 5rem;
}
/* <!-- 红色提示线样式 --> */
.ref-line {
  position: absolute;
  background-color: rgba(240, 132, 132, 0.9);
  z-index: 9999;
}

.v-line {
  width: 1px;
  /* height: 200px; */
}

.h-line {
  height: 1px;
  /* width: 200px; */
}
/* 设置组件的颜色组件 */
.setColorM .el-color-picker__trigger {
  width: 100%;
  background-color: #fff;
  /* height: 2rem; */
  height: 40px;
}

.setColorM .el-color-picker__trigger .el-color-picker__color {
  width: 50%;
}

.setColorM .el-color-picker__trigger .el-color-picker__icon {
  width: 50%;
  color: #363636;
  left: 75%;
}

.setColorM .m-colorPicker .colorBtn {
  width: 100% !important;
  height: 100% !important;
}

.temsbumit .elformcontent {
  text-align: center;
}
</style>
