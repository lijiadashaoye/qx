<template>
  <div id="rose-layout">
    <div class="leftnav">
      <div class="logo"><img src="../assets/img/loginTop.png" /></div>
      <div class="top">证书防伪平台管理系统</div>
      <!-- <div class="top"><img src="../assets/img/sgslogo.png">通测链</div> -->
      <div class="nav">
        <ul class="clickNav">
          <!-- <li
            @click="toPage('demo')"
          >
            <div
              class="img5"
            ></div>
            demo
            <span  class="dian"></span>
          </li> -->
          <li
            @click="toPage('templateManagement')"
            :class="{ activeNav: isType == 'templateManagement' }"
            v-if="perModel.findIndex((value) => value.id == 100200) >= 0"
          >
            <div
              class="img5"
              :class="{ accountImgActive: isType == 'templateManagement' }"
            ></div>
            模板管理
            <span v-if="isType === 'templateManagement'" class="dian"></span>
          </li>
          <li
            @click="toPage('certificateManagement')"
            :class="{ activeNav: isType == 'certificateManagement' }"
            v-if="perModel.findIndex((value) => value.id == 100300) >= 0"
          >
            <div
              class="img1"
              :class="{ userImgActive: isType == 'certificateManagement' }"
            ></div>
            证书管理
            <span v-if="isType === 'certificateManagement'" class="dian"></span>
          </li>
          <li
            @click="toPage('accountManagement')"
            :class="{ activeNav: isType == 'accountManagement' }"
            v-if="perModel.findIndex((value) => value.id == 100500) >= 0"
          >
            <div
              class="img2"
              :class="{ accountImgActive: isType == 'accountManagement' }"
            ></div>
            成员管理
            <span v-if="isType === 'accountManagement'" class="dian"></span>
          </li>
          <li
            @click="toPage('department')"
            :class="{ activeNav: isType == 'department' }"
            v-if="perModel.findIndex((value) => value.id == 100600) >= 0"
          >
            <div
              class="img6"
              :class="{ accountImgActive: isType == 'department' }"
            ></div>
            组织架构
            <span v-if="isType === 'department'" class="dian"></span>
          </li>
        </ul>
      </div>
    </div>
    <div class="right">
      <div class="rightTop">
        <div class="mianbaoxue">
          <div>
            <span
              style="color: #363636; font-size: 0.9rem; cursor: pointer"
              @click="backPage"
              >{{ routeType | yijiLink }}</span
            >
            <span style="color: #aaaaaa; font-size: 0.9rem">{{
              routeType | erjiLink
            }}</span>
          </div>
        </div>
        <div class="app_down_label">
          <div class="app_down_labelText">APP下载</div>
          <div class="app_down_labelQrcode">
            <div class="qrcode"></div>
            <div class="app_d_label_desc">扫码下载通测链APP</div>
          </div>
        </div>
        <el-popover
          popper-class="jifen_adamin"
          v-model="isShow"
          ref="popover4"
          style="margin-top: 0.5rem"
          placement="bottom-end"
          title="账户信息"
          width="300"
          trigger="click"
          :offset="20"
        >
          <div
            style="
              float: right;
              font-size: 14px;
              margin-top: -30px;
              margin-right: 10pxrem;
              cursor: pointer;
              width: 120px;
              text-align: right;
            "
          >
            <div
              @click="dialogFormVisible = true"
              style="
                display: inline-block;
                color: #f76a0d;
                cursor: pointer;
                text-align: right;
              "
            >
              修改密码
            </div>
            &nbsp;l&nbsp;
            <div
              @click="dialogFormUserinfo = true"
              style="
                display: inline-block;
                clear: both;
                color: #f76a0d;
                cursor: pointer;
              "
            >
              编辑
            </div>
          </div>

          <div style="text-align: left; margin: 0 0.5rem 0px 0.5rem">
            <div style="margin-bottom: 12px">
              <label for
                >姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</label
              >
              {{ userinfo.realName }}
            </div>

            <div style="margin-bottom: 12px">
              <label for
                >账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</label
              >
              {{ userinfo.username }}
            </div>

            <div style="margin-bottom: 12px">
              <label for
                >手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：</label
              >
              {{ userinfo.phone }}
            </div>
            <div
              style="margin-bottom: 20px"
              v-if="userinfo.roles && userinfo.roles[0]"
            >
              <label for
                >权&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;限：</label
              >
              {{ userinfo.roles[0].name }}
            </div>
            <div style="margin-bottom: 12px">
              <label for="">上链状态： </label>
              {{ userinfo.txStatus | txStatusString }}
              <span
                v-if="userinfo.txStatus == 2"
                style="color: #f76a0d; margin-left: 10px; cursor: pointer"
                @click="reTxSign"
                >重新上链</span
              >
            </div>
            <div style="margin-bottom: 12px">
              <label for="">用户协议：</label>

              <span
                style="cursor: pointer; text-decoration: underline"
                @click="showProtocol = true"
                >《通测链用户协议》</span
              >
            </div>
            <el-button
              style="width: 100%; margin-bottom: 0.5rem"
              type="primary"
              @click="logout"
              >退出登录</el-button
            >
          </div>
        </el-popover>
        <!-- <div class="app_down_label">
          <div class="app_down_labelText">APP下载</div>
          <div class="app_down_labelQrcode" >
            <div class="qrcode"></div>
            <div class="app_d_label_desc">扫码下载通测链APP</div>
          </div>
        </div> -->
        <div class="userOut">
          <img v-if="userinfo.username" src="../assets/img/userTop.png" alt />
          <div class="userName" v-popover:popover4>{{ userinfo.username }}</div>
          <img
            v-if="userinfo.username"
            style="width: 0.4rem; height: 0.25rem; margin-left: 0.5rem"
            src="../assets/img/downArrow.png"
            alt
          />
        </div>
      </div>
      <div class="rightMain">
        <router-view class="view" :key="$route.fullPath"></router-view>
      </div>
    </div>
    <el-dialog
      title="修改信息"
      :visible.sync="dialogFormUserinfo"
      width="21rem"
      :close-on-click-modal="false"
      class="updataPwd"
    >
      <el-form
        :inline="false"
        :inline-message="false"
        size="mini"
        :model="ruleForm"
        :rules="rules"
        ref="vimForm"
        class="demo-ruleForm"
        label-position="left"
        label-width="4rem"
      >
        <div class="demo-ruleForm">
          <div class="bttitle"></div>
          <el-form-item label="账号" prop="username">
            <el-input :disabled="true" v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="ruleForm.realName" maxlength="16"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model.number="ruleForm.phone"
              @keyup.native="changeAmountTwo"
              maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="role">
            <el-input
              :disabled="true"
              v-model="userinfo.roles[0].name"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogFormUserinfo = false;
            $refs.vimForm.resetFields();
            $refs.vimForm.clearValidate();
          "
          >取消</el-button
        >
        <el-button type="primary" @click="addData('vimForm')">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改密码"
      :visible.sync="dialogFormVisible"
      width="21rem"
      class="updataPwd"
      :close-on-click-modal="false"
    >
      <el-form
        ref="changeForm"
        :model="pwdform"
        label-position="left"
        label-width="4rem"
      >
        <div class="demo-ruleForm">
          <el-form-item label="原密码" prop="oldPassword">
            <el-input
              type="password"
              v-model="pwdform.oldPassword"
              placeholder="请输入旧密码"
              maxlength="16"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              type="password"
              v-model="pwdform.newPassword"
              placeholder="请设置新密码"
              maxlength="16"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="isurenewPassword">
            <el-input
              type="password"
              v-model="pwdform.isurenewPassword"
              placeholder="请确认新密码"
              maxlength="16"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogFormVisible = false;
            $refs.changeForm.resetFields();
            $refs.changeForm.clearValidate();
          "
          >取消</el-button
        >
        <el-button type="primary" @click="updatePassword('changeForm')"
          >确认</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="友情提示："
      class="protocal_dia"
      :visible.sync="showIE"
      width="21rem"
      :close-on-click-modal="false"
    >
      <div style="hegiht: 32px; line-height: 32px">
        建议您使用chrome浏览器或者360浏览器打开此平台
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="height: 1rem"></div>
      </div>
    </el-dialog>
    <el-dialog
      title="通测链用户协议"
      class="protocal_dia"
      :show-close="false"
      :visible.sync="isAgree"
      width="21rem"
      :close-on-click-modal="false"
    >
      <div style="hegiht: 32px; line-height: 32px">
        尊敬的用户, 登录前请先仔细阅读并同意
        <span
          @click="showProtocol = true"
          style="text-decoration: underline; color: #ff6670; cursor: pointer"
          >《通测链用户协议》</span
        >
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="agreeProtocol('no')"> 不同意 </el-button>
        <el-button type="primary" @click="agreeProtocol('')">同意</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      class="dloag dialogTitleBorder diloagTwo"
      title="通测链用户协议"
      :visible.sync="showProtocol"
      width="26rem"
    >
      <!-- <div class="titleBorder"></div> -->
      <div
        class="protocalBox"
        style="width: 23rem; height: 28.8rem; overflow-y: auto"
      >
        <p>
          为了更好地为您提供服务，请您仔细阅读并充分理解以下《通测链用户协议》（下称“本协议”）、充分理解各条款内容。
        </p>

        <p>
          如果您对本协议的任何条款表示异议，您可以选择不下载、安装、注册、登录、使用（以下统称“使用”）通测链为您提供的任何软件或服务。无论您以何种方式使用通测链提供的任何软件服务，即视为您已充分理解本协议并承诺作为本协议的一方当事人完全接受本协议的全部条款。
        </p>

        <p class="p1">1 本协议适用范围</p>
        <p class="p2">
          1.1
          本协议是用户（您）与通测链（法律主体）及提供的相关服务可能存在的运营关联单位（下称“通测链”）之间关于您使用通测链相关软件或服务所订立的协议。“用户”或“您”均指通测链相关软件及服务的使用人。
        </p>
        <p class="p2">
          1.2
          本协议项下的“通测链相关软件或服务”是指通测链向用户提供的包括但不限于产品溯源、证书防伪、电子存证、区块链技术开发、电子商务和广告等产品、软件及服务。
        </p>
        <p class="p2">
          1.3
          您在使用通测链某一特定软件或服务时，该服务可能会另有已经发布或后续可能不断发布的单独的协议、相关业务规则等（以下统称为“单独协议或规则”）。上述内容一经正式发布，即为本协议不可分割的组成部分，您同样应当遵守。您对前述任何业务规则、单独协议的接受，即视为您对本协议全部的接受。
        </p>
        <p class="p1">2 服务说明</p>
        <p class="p2">2.1 通测链向您提供包括但不限于如下软件或服务:</p>
        <p class="p2_">- 通测链产品溯源、报告防伪、电子存证等区块链应用；</p>
        <p class="p2_">
          - 通测链网（域名：www.tongcelian.com、www.tic-chain.com
          ）及其他由通测链运营的任何网站；
        </p>
        <p class="p2_">
          -
          通测链直接拥有或运营的包括但不限于PC、平板、手机等全部终端客户端产品，如通测链溯源App等；
        </p>
        <p class="p2_">- 通测链直接拥有或运营的服务器、网络存储空间；</p>
        <p class="p2_">- 通测链提供给您的其他软件、技术或服务。</p>

        <p class="p2">
          2.2
          您使用通测链相关软件或服务，可以通过预装、通测链内下载、通测链已授权的第三方下载等方式获取相关客户端或访问通测链网站。若您并非从前述途径，而是通过其他任何途径、渠道、方式获取通测链软件或服务的（包括但不限于帐号、客户端下载等）均为非法行为，通测链概不承认其效力，一经发现，通测链有权立即作出删除、清零、封号等处理，任何因此导致的一切不利后果均由您自行承担。
        </p>
        <p class="p2">
          2.3
          通测链可能为不同的终端设备开发了不同的应用程序软件版本，您应当根据实际设备状况获取、下载、安装合适的版本。为更好的提升用户体验及服务，通测链将不时提供软件更新或改变（包括但不限于软件修改、升级、功能强化、开发新服务、软件替换等），通测链将以包括但不限于系统提示、公告、站内信等方式提示您更新、下载或使用，您有权选择接受更新版本或服务，如果您不同意或者不接受通测链相关软件或服务的改变，请直接拒绝、停止、取消使用行为，否则视为您同意并接受改变，同时该同意并接受的行为仍受本协议约束。
        </p>
        <p class="p2">
          2.4
          您仅可以合法使用通测链相关软件或服务为目的或方式而使用通测链相关软件或服务，除非得到通测链明示事先书面授权，否则，您不得以任何形式改编、复制、传播、垂直搜索、镜像或交易通测链相关软件或服务。本协议未明示授权的其他一切权利仍由通测链保留，您在行使该些权利时须另行获得通测链的书面许可，同时通测链如未行使前述任何权利，并不构成对该权利的放弃。
        </p>
        <p class="p1">3 用户注册及帐号</p>
        <p class="p2">
          3.1
          通测链所提供的均为专业领域的商业服务，用户必需注册后方可开始使用通测链相关软件或服务。
        </p>
        <p class="p2">
          3.2
          您理解并承诺，您所设置的帐号不得违反国家法律法规及通测链的相关规则，不得实施任何侵害国家利益、损害其他公民合法权益，有害社会道德风尚的行为，您的帐户名称、头像和简介等注册信息及其他信息中不得出现违法和不良信息，未经他人许可不得用他人名义（包括但不限于冒用他人或机构的姓名、名称、字号、头像等足以让人引起混淆的方式）开设帐号，不得恶意注册通测链帐号（包括但不限于频繁注册、批量注册帐号等行为）。您在帐户注册及使用过程中需遵守法律法规、社会主义制度、国家利益、公民合法权益、社会公共秩序、道德风尚及信息真实性等“七条底线”要求。
        </p>
        <p class="p2">
          3.3
          您在通测链的注册帐号所有权及有关权益均归通测链所有，您完成注册手续后仅享有该帐号的使用权。您的帐号仅限于您本人/本机构使用，未经通测链书面同意，禁止以任何形式赠与、借用、出租、转让、售卖或以其他方式许可他人使用该帐号。如果通测链发现或者有合理理由认为使用者并非帐号初始注册人，通测链有权在未通知您的情况下，暂停或终止向该注册帐号提供服务，并有权注销该帐号，而无需向注册该帐号的用户承担法律责任。
        </p>
        <p class="p2">
          3.4
          您有责任维护帐号、密码的安全性与保密性，并对您以注册帐号名义所从事的活动承担全部法律责任，包括但不限于数据的上传、修改、使用其他在通测链的操作行为。
        </p>
        <p class="p2">
          3.5
          在注册、使用和管理帐号时，您应保证注册帐号时填写的身份信息的真实性，请您在注册、管理帐号时使用真实、准确、合法、有效的相关身份证明材料或工商登记材料及必要信息（包括您的姓名、所在机构名称及电子邮件地址、联系电话、联系地址等），若国家法律法规有特殊规定，您需要填写真实的身份信息，请您按照相关法律规定完成实名认证，以便通测链在必要时与您联系或为您提供更好的服务，并注意及时更新上述相关信息。若您提交的材料或提供的信息不准确、不真实、不合法或者通测链有理由怀疑为错误、不实或不合法的资料，则您可能无法使用通测链相关软件或服务，或在使用过程中部分功能受到限制。
        </p>
        <p class="p2">
          3.6
          因其他人恶意攻击或您自身原因或其他不可抗因素而导致帐号被盗、丢失，通测链不承担任何责任。
        </p>
        <p class="p2">
          3.7
          在丢失账号或遗忘密码时，您可联系客服帮助您找回账号或密码。您理解并认可，通测链的账号或密码找回机制需要您向客服提交的信息与系统记录资料具有一致性，而无法识别申诉找回账号或密码的是否系真正账号有权使用者。通测链特别提醒您应妥善保管您的账号和密码。当您使用完毕后，应安全退出。如因您保管不当等自身原因或其他不可抗因素导致遭受盗号或密码丢失，您将自行承担相应责任。
        </p>
        <p class="p2">
          3.8
          通测链依照本协议、相关规则限制您使用帐号全部或部分功能的，可能会给您造成一定的损失，您理解该损失由您自行承担，通测链不承担责任。
        </p>
        <p class="p1">4 用户信息保护</p>

        <p class="p2">
          4.1
          通测链与用户一同致力于用户信息的保护，保护用户信息是通测链的基本原则之一。除非法律法规及本协议另有规定，否则未经用户同意，通测链不会向通测链以外的任何公司、组织和个人披露您的信息。
        </p>
        <p class="p2">
          4.2
          通测链将在通测链相关软件或服务中使用相应的安全技术及其他安全措施并建立完善的管理制度来保护您的信息。
        </p>
        <p class="p2">
          4.3
          通测链不会将用户个人信息转移或披露给任何非关联的第三方，除非有如下情形之一或更多：
        </p>
        <p class="p3">4.3.1 相关法律法规或司法、行政等国家机关要求；</p>
        <p class="p3">4.3.2 为完成合并、分立、收购或资产转让而转移；</p>
        <p class="p3">4.3.3 获得用户或未成年用户监护人的授权；</p>
        <p class="p3">4.3.4 为维护通测链自身合法权益而向用户提起诉讼或仲裁；</p>
        <p class="p3">4.3.5 通测链及其关联公司为提供您要求的服务所必需；</p>
        <p class="p3">4.3.6 用户自行向第三方公开其信息</p>
        <p class="p3">
          4.3.7
          由于用户将其用户密码告知他人或与他人共享注册帐户与密码，由此导致的任何信息的泄露，或其他非因通测链原因导致的信息的泄露；
        </p>
        <p class="p3">
          4.3.8
          为检测有害及欺诈用户而向第三方披露，但通测链应与该第三方签订协议，以确保该第三方承担不低于本协议的责任和义务；
        </p>
        <p class="p3">
          4.3.9
          任何由于黑客攻击、电脑病毒侵入及其他不可抗力事件导致用户信息的泄露。
        </p>
        <p class="p3">4.3.10 其他合理情形</p>
        <p class="p2">4.4 用户同意通测链可在以下事项中使用用户的信息：</p>
        <p class="p3">
          (1) 通测链向用户及时发送重要通知，如软件更新、本协议条款的变更；
        </p>
        <p class="p3">
          (2)
          通测链内部进行审计、数据分析和研究等，以改进通测链的产品、服务和与用户之间的沟通；
        </p>
        <p class="p3">
          (3) 依本协议约定，通测链管理、审查用户信息及进行处理措施；
        </p>
        <p class="p3">(4) 适用法律法规规定的其他事项。</p>
        <p class="p">
          除上述事项外，如未取得用户事先同意，通测链不会将用户信息使用于任何其他用途。
        </p>
        <p class="p1">5 用户行为规范</p>
        <p class="p2">
          5.1
          除非法律允许或者经通测链事先书面许可，您使用通测链相关软件或服务不得具有下列行为：
        </p>
        <p class="p3">
          5.1.1
          使用未经通测链授权或许可的任何软件、插件、外挂、系统或第三方工具对通测链相关软件或服务的正常运行进行干扰、破坏、修改或施加其他影响。
        </p>
        <p class="p3">
          5.1.2
          使用通测链相关软件或服务提交、制作、上传、复制、发布、传播或传递以下内容：反对宪法所确定的基本原则的；危害国家安全；泄露国家秘密，颠覆国家政权，煽动分裂国家，破坏国家统一，宣扬恐怖主义、极端主义的；损害国家荣誉和利益的；煽动民族仇恨、民族歧视，破坏民族团结的；破坏国家宗教政策，宣扬邪教和封建迷信的；散布谣言，扰乱社会秩序，破坏社会稳定的；散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；侵害未成年人合法权益或者损害未成年人身心健康的；未获他人允许，偷拍、偷录他人，侵害他人合法权利的；包含恐怖、暴力血腥、高危险性、危害表演者自身或他人身心健康内容的；对他人进行暴力恐吓、威胁，实施人肉搜索的，侮辱或者诽谤他人，侵害他人隐私权、名誉权、肖像权、知识产权、商业秘密等合法权益的；含有任何性或性暗示的；含有辱骂、恐吓、威胁内容的；含有骚扰、垃圾广告、恶意信息、诱骗信息的；散布商业广告，或类似的商业招揽信息、过度营销信息及垃圾信息；使用本网站常用语言文字以外的其他语言文字评论的；与所评论的信息毫无关系的；所发表的信息毫无意义的，或刻意使用字符组合以逃避技术审核的；含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息；含有法律、行政法规禁止的其他内容的信息。
        </p>
        <p class="p3">
          5.1.3
          利用或针对通测链相关软件或服务进行任何危害计算机网络安全的行为，包括但不限于：
        </p>
        <p class="p4">
          5.1.3.1 使用未经许可的数据或进入未经许可的服务器/帐户；
        </p>
        <p class="p4">
          5.1.3.2
          未经允许进入公众计算机网络或者他人计算机系统并删除、修改、增加存储信息；
        </p>
        <p class="p4">
          5.1.3.3
          未经许可，企图探查、扫描、测试通测链相关软件或服务的系统或网络的弱点或实施其他破坏网络安全的行为；
        </p>
        <p class="p4">
          5.1.3.4
          企图干涉、破坏通测链相关软件或服务的系统或网站的正常运行，故意传播恶意程序或病毒以及其他破坏干扰正常网络信息服务的行为；
        </p>
        <p class="p4">
          5.1.3.5
          非法侵入他人网络、干扰他人网络正常功能、窃取网络数据等危害网络安全的活动；
        </p>
        <p class="p4">
          5.1.3.6
          提供专门用于从事侵入网络、干扰网络正常功能及防护措施、窃取网络数据等危害网络安全活动的程序、工具；
        </p>
        <p class="p4">
          5.1.3.7
          明知他人从事危害网络安全的活动的，为其提供技术支持、广告推广、支付结算等帮助；
        </p>
        <p class="p4">5.1.3.8 伪造TCP/IP数据包名称或部分名称；</p>
        <p class="p3">
          5.1.4
          对通测链相关软件进行反向工程、反向汇编、编译或者以其他方式尝试发现本软件的源代码。
        </p>
        <p class="p3">
          5.1.5
          恶意注册、使用通测链帐号，包括但不限于频繁、批量注册帐号、建立虚假账号、故意冒充他人等。
        </p>
        <p class="p3">
          5.1.6
          提交、发布虚假信息，或盗用他人头像或资料，冒充任何人或机构，或以任何方式方式谎称或误导，使人误认为与任何人或任何机构有关。
        </p>
        <p class="p3">
          5.1.7 强制、诱导其他用户关注、点击链接页面或分享信息的;
        </p>
        <p class="p3">5.1.8 虚构事实、隐瞒真相以误导、欺骗他人的；</p>
        <p class="p3">
          5.1.9 利用通测链的账户或本协议项下的服务从事任何违法犯罪活动的
        </p>
        <p class="p3">
          5.1.10
          制作、发布与以上行为相关的方法、工具，或对此类方法、工具进行运营或传播，无论这些行为是否为商业目的；
        </p>
        <p class="p3">
          5.1.11
          违反法律法规、本协议、通测链的相关规则及侵犯他人合法权益或通测链未明确授权的其他行为。
        </p>
        <p class="p2">
          5.2
          您同意遵守《通测链社区规范》您所使用的特定软件或服务的单独协议或规则及其他通测链及相关公司发布的关于使用通测链相关软件或服务的使用规范、协议或制度。
        </p>
        <p class="p2">
          5.3
          未经通测链书面许可，任何人或机构，不得自行或授权、允许、协助其他人或机构复制、读取、抓取或采用通测链相关软件或服务中的任何信息内容（亦不可擅自编辑修改后使用）。
        </p>
        <p class="p2">
          5.4
          通测链有权对用户使用通测链相关软件或服务的情况进行审查和监督，如通测链有理由认为用户在使用通测链相关软件或服务时违反上述任何规定，通测链或其授权的人或机构在任何时候有权进行独立判断并采取技术手段予以删除、屏蔽、断开链接，无需任何通知，同时，通测链有权视用户的行为性质，采取包括但不限于暂停或终止服务，限制、冻结或终止通测链账号使用，追究相关法律责任等措施。
        </p>

        <p class="p1">6 知识产权</p>
        <p class="p2">
          6.1
          除通测链与您另有约定外，您在通测链相关软件或服务中上传的全部内容（包括但不限于检测报告、认证证书、产品照片、文字描述等信息）均归用户所有，用户可授权第三方以任何形式使用，无需通测链同意。
        </p>
        <p class="p2">
          6.2
          通测链相关软件或服务中包含的标识、版面设计、排版方式、文本、图片、图形、音频、视频、创意、模式等均受著作权、商标权及其它法律保护，未经相关权利人（含通测链及其他原始权利人）书面同意，上述内容均不得因出于发布或使用目的的改写或再发行，或被用于其他任何商业目的。
        </p>
        <p class="p2">
          6.3
          在通测链上传、发布的内容，您应保证您为权利人或其他就上述内容享有合法权利的权利人的合法授权，并且该内容不会侵犯任何第三方的合法权益。如果第三方提出关于知识产权或其他合法权益的异议，通测链有权追究您的法律责任。给通测链或任何第三方造成损失的，您应负责全额赔偿。
        </p>
        <p class="p2">
          6.4
          通测链有权但无义务对您上传、发布的内容进行审核，有权根据相关证据结合《侵权责任法》等法律法规及通测链业务规范对侵权信息进行处理。
        </p>
        <p class="p2">
          6.5
          通测链对通测链相关软件或服务的开发或运营过程中产生的所有数据和信息等享有全部权利。
        </p>
        <p class="p1">7 法律责任</p>
        <p class="p2">
          7.1
          如果通测链发现或收到他人举报或投诉用户违反本协议约定的，通测链有权不经通知随时对相关内容，包括但不限于用户资料、聊天、交易记录进行审查、删除，并视情节轻重对违规账号处以包括但不限于警告、账号封禁
          、设备封禁 、功能封禁、删除或屏蔽发布的信息、停止提供服务等处罚。
        </p>
        <p class="p2">
          7.2
          因违反用户协议被封禁的用户不会自动解封。可向通测链提交申诉，通测链将对申诉进行审查，并自行合理判断决定是否变更处罚措施。
        </p>
        <p class="p2">
          7.3
          用户理解并同意，通测链有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应承担由此而产生的一切法律责任。
        </p>
        <p class="p2">
          7.4
          用户理解并同意，因用户违反本协议约定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，用户应当赔偿通测链与合作公司、关联公司，并使之免受损害。
        </p>
        <p class="p1">8 免责声明</p>
        <p class="p2">
          8.1
          通测链对用户所上传、发布、传递的信息、资料的正确性、真实性、合法性、有效性等方面不负任何法律责任。用户需自行对上述内容负责。因上述内容引发的一切纠纷，由该用户承担全部法律及连带责任，通测链不承担任何法律及连带责任。
        </p>
        <p class="p2">
          8.2
          通测链不保证通测链相关软件或服务：完全符合用户的使用要求或期望；及时、安全、可靠或不出现错误；任何错误都将能被更正。
        </p>
        <p class="p2">
          8.3
          通测链有权在提前公告通知后，修改、更新、中断或终止通测链相关软件或服务，无需向用户负责或承担任何赔偿责任。
        </p>
        <p class="p2">
          8.4
          对于因不可抗力或通测链不能控制的原因（包括但不限于：病毒、木马、恶意程序攻击、网络问题、系统不稳定、系统或设备故障、通讯故障、电力故障、银行原因、第三方服务瑕疵、政府行为、自然灾害等）造成的网络服务中断或其它缺陷，通测链不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。
        </p>
        <p class="p2">
          8.5
          您理解并同意，关于通测链软件及相关服务，通测链不提供任何种类的明示或暗示担保或条件，包括但不限于商业适售性、特定用途适用性等。您对通测链软件及相关服务的使用行为需自行承担相应风险。
        </p>
        <p class="p2">
          8.6
          您理解并同意，本协议是在保障遵守国家法律法规、维护公序良俗，保护他人合法权益，通测链在能力范围内尽最大的努力按照相关法律法规进行判断，但并不保证通测链判断完全与司法机关、行政机关的判断一致，如因此产生的后果您已经理解并同意自行承担。
        </p>
        <p class="p2">
          8.7
          在任何情况下，通测链均不对任何间接性、后果性、惩罚性、偶然性、特殊性或刑罚性的损害，包括因您使用通测链软件及相关服务而遭受的利润损失，承担责任。通测链对您承担的全部责任，无论因何原因或何种行为方式，始终不超过您在因使用通测链软件及相关服务而支付给通测链的费用(如有)。
        </p>
        <p class="p1">9 协议修改及其他</p>
        <p class="p2">
          9.1
          本协议的成立、生效、履行、解释及争议的解决均应适用中华人民共和国大陆地区法律。根据履行环境变化或有关法律、法规及规范性文件的变化，或因业务发展需要，通测链有权对本协议的条款作出修改或变更。一旦本协议的内容发生变动，通测链会在协议生效前将修改后的协议在通测链软件上予以公布，该公布行为视为通测链已经通知用户修改的内容。通测链也可采用电子邮件或私信的传送方式，提示通测链用户协议的修改、服务变更、或其它重要事项，您也可以在网站首页或软件设置页面查阅最新版本的协议条款。如果您不同意通测链对本协议相关条款所做的修改，用户有权并应当停止使用通测链相关软件或服务。如果用户继续使用通测链相关软件或服务，则视为用户接受通测链对本协议相关条款所做的修改。倘本协议之任何规定因与中华人民共和国大陆地区的法律抵触而无效，则这些条款将尽可能接近本协议原条文意旨重新解析，且本协议其它规定仍应具有完整的效力及效果。
        </p>
        <p class="p2">
          9.2
          根据履行环境变化或有关法律、法规及规范性文件的变化，或因业务发展需要，通测链有权对本协议的条款作出修改或变更。一旦本协议的内容发生变动，通测链会在协议生效前将修改后的协议在通测链软件上予以公布，该公布行为视为通测链已经通知用户修改的内容。通测链也可采用电子邮件或私信的传送方式，提示通测链用户协议的修改、服务变更、或其它重要事项，您也可以在网站首页或软件设置页面查阅最新版本的协议条款。如果您不同意通测链对本协议相关条款所做的修改，用户有权并应当停止使用通测链相关软件或服务。如果用户继续使用通测链相关软件或服务，则视为用户接受通测链对本协议相关条款所做的修改。
        </p>
        <p class="p2">
          9.3
          本协议中的标题仅为方便及阅读而设，并不影响本协议中任何规定的含义或解释。本协议的版权为通测链所有，通测链保留一切解释和修改的权利。
        </p>
        <p class="p2">
          9.4
          本协议履行过程中若发生争议的，应先友好协商解决，协商不成的，任何一方均可向法院提起诉讼。
        </p>
        <p class="p2">
          9.5
          请您在发现任何违反本用户协议、各类公告之情形时，您可以通过联络通测链客服通知通测链。
        </p>
      </div>
      <div style="height: 35px; width: 100%"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  apiAddUser,
  apiupdatePassword,
  getSysUserDepartmentList,
  uploadTX,
  baseAgreement,
} from "api/account.js";
import { getJwtTokenConsortium } from "api/upChain.js";
import { apiUserInfo, apiUserLogout } from "api/login.js";
// import QRCode from 'qrcodejs2';
import signature from "../mixins/signatureMixin.js";
import aes from "utils/aes.js";
import { Loading } from "element-ui";
import sha256 from "sha256";
export default {
  mixins: [signature],
  data() {
    // var validatePass1 = (rule, value, callback) => {
    //   if (value == "") {
    //     callback(new Error("请输入密码!"));
    //   } else if (this.pwdform.isurenewPassword != "") {
    //     if (value != this.pwdform.isurenewPassword) {
    //       callback(new Error("两次输入密码不一致!"));
    //     } else {
    //       callback();
    //       this.$refs.changeForm.validateField("isurenewPassword");
    //     }
    //   } else {
    //     callback();
    //   }
    // };
    // var validatePass2 = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请再次输入密码"));
    //   } else if (value !== this.pwdform.newPassword) {
    //     callback(new Error("两次输入密码不一致!"));
    //   } else {
    //     callback();
    //   }
    // };
    // var valid3 = (rule, value, callback) => {
    //   if (!/^1[3|4|5|6|9|7|8]\d{9}$/.test(value)) {
    //     callback(new Error("手机格式有误！"));
    //   } else {
    //     callback();
    //   }
    // };
    // var validatePass = (rule, value, callback) => {
    //   var re = /^[a-zA-Z0-9]+$/;
    //   if (!re.test(value)) {
    //     // this.$message({message:'密码必须是小于16的位的英文或数字',type:'error'})
    //     callback(new Error("密码必须是英文或数字"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      showIE: false,
      showProtocol: false,
      isAgree: false,
      vLine: [],
      hLine: [],
      role: "",
      dialogFormVisible: false,
      dialogFormUserinfo: false,
      isShow: false,
      pwdform: {
        oldPassword: "",
        newPassword: "",
        isurenewPassword: "",
      },
      rules: {
        username: [{ required: false, message: "姓名必须填" }],
        realName: [{ required: false, message: "账号必须填" }],
      },
      ruleForm: {
        phone: null,
        username: "",
        realName: "",
      },
      userinfo: { roles: [{ name: "" }], role: {}, user: {} },
      touxiang: "../../static/img/prizeImg.png",
      isType: "",
      routeType: "",
      permissionArr: "",
      perModel: [],
    };
  },
  methods: {
    IEVersion() {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      var isIE =
        userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
      var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
      var isIE11 =
        userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
      if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
          return 7;
        } else if (fIEVersion == 8) {
          return 8;
        } else if (fIEVersion == 9) {
          return 9;
        } else if (fIEVersion == 10) {
          return 10;
        } else {
          return 6; //IE版本<=7
        }
      } else if (isEdge) {
        return "edge"; //edge
      } else if (isIE11) {
        return 11; //IE11
      } else {
        return false; //不是ie浏览器
      }
    },
    agreeProtocol(status) {
      if (status == "no") {
        this.isAgree = false;
        this.logout();
        return;
      }
      baseAgreement();
      this.isAgree = false;
    },
    changeAmountTwo() {
      this.addParams.phone = this.addParams.phone
        .toString()
        .replace(/[^\d]/g, "");
    },
    async reTxSign() {
      let PublicKey = JSON.parse(sessionStorage.getItem("PPkey")).pubK;
      let result = await getSysUserDepartmentList({ id: this.userinfo.id });
      let valueInfo = Object.assign(
        {},
        {
          username: this.userinfo.username,
          pubKey: PublicKey,
          realName: sha256(this.userinfo.realName),
          phone: sha256(this.userinfo.phone),
          department: sha256(result),
          desc: "修改账户信息重新上链",
        }
      );
      let params = {
        phone: this.userinfo.phone,
        realName: this.userinfo.realName,
        txSign: await this.txSign(3, valueInfo),
      };

      apiAddUser(params).then((response) => {
        this.dialogFormUserinfo = false;
        (this.pwdform = {
          oldPassword: "",
          newPassword: "",
          isurenewPassword: "",
        }),
          this.getUserInfo();
        this.$message({
          message: "重新上链请求已发送！",
          type: "success",
        });
      });
    },
    backPage() {
      let url = "";
      if (
        this.routeType == "certificateManagement" ||
        this.routeType == "issueCertificate" ||
        this.routeType == "cerfityLook" ||
        this.routeType == "batchIssue"
      ) {
        url = "certificateManagement";
      }
      if (
        this.routeType == "templateManagement" ||
        this.routeType == "templateEdit" ||
        this.routeType == "templateAdd"
      ) {
        url = "templateManagement";
      }
      if (this.routeType == "permission" || this.routeType == "accountList") {
        url = "accountManagement";
      }
      if (this.routeType == "department") {
        url = "department";
      }
      this.$router.push({ path: url });
    },
    async updatePassword(type) {
      if (!this.pwdform.oldPassword || this.pwdform.oldPassword.length == 0) {
        this.$message({
          message: "请输入原密码!",
          type: "warning",
        });
        return;
      }
      if (!this.pwdform.newPassword || this.pwdform.newPassword.length == 0) {
        this.$message({
          message: "请输入新密码!",
          type: "warning",
        });
        return;
      }
      if (
        !this.pwdform.isurenewPassword ||
        this.pwdform.isurenewPassword.length == 0
      ) {
        this.$message({
          message: "请再次输入密码!",
          type: "warning",
        });
        return;
      }
      if (this.pwdform.isurenewPassword !== this.pwdform.newPassword) {
        this.$message({
          message: "两次密码不一致!",
          type: "warning",
        });
        return;
      }
      var re = /^[a-zA-Z0-9]+$/;
      if (!re.test(this.pwdform.newPassword)) {
        this.$message({
          message: "密码必须是英文或数字!",
          type: "warning",
        });
        return;
      }
      if (this.pwdform.newPassword.length > 16) {
        this.$message({
          message: "密码必须是小于16的位的英文或数字!",
          type: "warning",
        });
        return;
      }
      let PPkey = this.resetPubkey(this.pwdform.newPassword);

      let result = await getSysUserDepartmentList({ id: this.userinfo.id });

      console.log(result)
      let valueInfo = Object.assign(
        {},
        {
          username: this.userinfo.username,
          pubKey: PPkey.pubK,
          realName: sha256(this.userinfo.realName),
          phone: sha256(this.userinfo.phone),
          department: sha256(result),
          desc: "修改密码",
        }
      );

      let txSign = await this.txSign(3, valueInfo);
      let params = {
        // username:this.userinfo.user.username,
        oldPwd: this.$md5(this.pwdform.oldPassword),
        newPwd: this.$md5(this.pwdform.newPassword),
        pubKey: PPkey.pubK,
        privateEncryptKey: PPkey.priK,
        txSign: txSign,
      };

      // apiupdatePassword(params).then((response) => {
      //   this.dialogFormVisible = false;
      // });
    },
    async postInfo() {
      let PublicKey = JSON.parse(sessionStorage.getItem("PPkey")).pubK;
      let result = await getSysUserDepartmentList({ id: this.userinfo.id });
      let valueInfo = Object.assign(
        {},
        {
          username: this.userinfo.username,
          pubKey: PublicKey,
          realName: sha256(this.userinfo.realName),
          phone: sha256(this.userinfo.phone),
          department: sha256(result),
          desc: "修改个人账户信息",
        }
      );
      let params = {
        phone: this.ruleForm.phone,
        realName: this.ruleForm.realName,
        txSign: await this.txSign(3, valueInfo),
      };

      apiAddUser(params).then((response) => {
        this.dialogFormUserinfo = false;
        (this.pwdform = {
          oldPassword: "",
          newPassword: "",
          isurenewPassword: "",
        }),
          this.getUserInfo();
        this.$message({
          message: "修改成功！",
          type: "success",
        });
      });
    },
    addData() {
      if (!this.ruleForm.username || this.ruleForm.username.length == 0) {
        this.$message({
          message: "账号不能为空!",
          type: "warning",
        });
        return;
      }
      if (!this.ruleForm.realName || this.ruleForm.realName.length == 0) {
        this.$message({
          message: "姓名不能为空!",
          type: "warning",
        });
        return;
      }
      if (!this.ruleForm.phone || this.ruleForm.phone.length == 0) {
        this.$message({
          message: "手机号不能为空!",
          type: "warning",
        });
        return;
      }
      if (!/^1[3|4|5|6|9|7|8]\d{9}$/.test(this.ruleForm.phone)) {
        this.$message({
          message: "手机号格式有误!",
          type: "warning",
        });
        return;
      }
      this.postInfo();
      // }
      // });
    },
    async getUserInfo(state) {
      Loading.service();

      let result = await apiUserInfo().catch((e) => {
        console.log(e);
      });

      if (!result.agreement) {
        this.isAgree = true; //同意
      }
      this.userinfo = result;
      this.ruleForm = {
        username: result.username,
        realName: result.realName,
        phone: result.phone,
      };
      // this.role=result.roles[0].name
      sessionStorage.setItem("user", JSON.stringify(result));
      let user_ = JSON.parse(sessionStorage.getItem("user"));

      this.permissionArr = JSON.parse(
        sessionStorage.getItem("user")
      ).roles[0].permissions;
      this.perModel = JSON.parse(sessionStorage.getItem("permissionModel"));
      //判断是否要生成上链信息（私钥）

      if (result.isUpdateKey && state == "init") {
        //钱包
        let walletAccount = await this.wallet();
        let privateKey = walletAccount.privateKey;
        let PublicKey = walletAccount.signingKey.keyPair.compressedPublicKey;
        let address = this.checkAddress(privateKey);
        let salt = sessionStorage.getItem("salt");
        //生成加密对
        let aesData = aes.Encrypt(privateKey, salt);
        let o_ = { address: address, pubK: PublicKey, priK: aesData };
        sessionStorage.setItem("PPkey", JSON.stringify(o_));
        let userinfo = JSON.parse(sessionStorage.getItem("user"));
        let noce = await this.getNoce();
        let versionParams = {
          userName: userinfo.username,
          type: 3, //溯源-管理员上链
        };
        //获取version
        let version = await this.getVersion(3, userinfo.username);
        let jwt = this.messageSign(3, userinfo.username);
        let result = 0;
        let result_ = await getSysUserDepartmentList({ id: this.userinfo.id });

        let valueInfo = Object.assign(
          {},
          {
            username: userinfo.username,
            pubKey: PublicKey,
            realName: sha256(userinfo.realName),
            phone: sha256(userinfo.phone),
            department: sha256(result_),
            desc: "设置私钥",
          }
        );
        let lolJwt = await getJwtTokenConsortium();
        let sginPrams = this.tranSgin(
          3,
          userinfo.username,
          valueInfo,
          version,
          jwt,
          noce,
          lolJwt
        );
        let params = {
          privateEncryptKey: aesData,
          pubKey: PublicKey,
          txSign: sginPrams,
        };
        uploadTX(params).then((result) => {
          Loading.service().close();
          sessionStorage.setItem("hasCreatedChaininfo", false);
        });
        sessionStorage.setItem("hasCreatedChaininfo", result.isUpdateKey);
      } else {
        Loading.service().close();
        sessionStorage.setItem(
          "PPkey",
          JSON.stringify({
            address: "",
            pubK: result.pubKey,
            priK: result.privateEncryptKey,
          })
        );
        sessionStorage.setItem("hasCreatedChaininfo", result.isUpdateKey);
      }
    },
    async getUserInfo_(state) {
      Loading.service();
      let result = await apiUserInfo().catch((e) => {
        console.log(e);
      });
      if (!result.agreement) {
        this.isAgree = true; //同意
      }
      this.userinfo = result;
      this.ruleForm = {
        username: result.username,
        realName: result.realName,
        phone: result.phone,
      };
      sessionStorage.setItem("user", JSON.stringify(result));
      //判断是否要生成上链信息（私钥）
      Loading.service().close();
      sessionStorage.setItem("hasCreatedChaininfo", result.isUpdateKey);
    },
    logout() {
      apiUserLogout().then((resposne) => {
        sessionStorage.clear();
        this.$router.push({ path: "/" });
      });
    },
    toPage(routePath) {
      this.isType = routePath;
      this.$router.push({ path: routePath });
    },
    creatChainInfo(desc, result_) {
      // 创建私钥
      let walletAccount = this.wallet();
      let privateKey = walletAccount.privateKey;
      let PublicKey = walletAccount.signingKey.keyPair.compressedPublicKey;
      let address = this.checkAddress(privateKey);
      let salt = sessionStorage.getItem("salt");
      let aesData = aes.Encrypt(privateKey, salt);
      let o_ = { address: address, pubK: PublicKey, priK: aesData };
      sessionStorage.setItem("PPkey", JSON.stringify(o_));
      let userinfo = JSON.parse(sessionStorage.getItem("user"));
      let valueInfo = Object.assign(
        {},
        {
          username: userinfo.username,
          pubKey: PublicKey,
          realName: sha256(userinfo.realName),
          phone: sha256(userinfo.phone),
          department: sha256(result_),
          desc: desc,
        }
      );
      let txsign = this.txSign(3, valueInfo);
      let params = {
        privateEncryptKey: aesData,
        pubKey: PublicKey,
        txSign: txsign,
      };
      uploadTX(params).then((result) => {
        Loading.service().close();
        // console.log(privateKey,PublicKey,aesData,'私钥，公钥，加密对');
        sessionStorage.setItem("hasCreatedChaininfo", false);
      });
    },
  },
  created() {
    // let isIe =this.IEVersion()
    // if(isIe){
    //   this.showIE=true
    // }

    if (this.$route.path.substring(1).slice(7) == "userDetail") {
      this.isType = "userManagement";
    } else if (this.$route.path.substring(1).slice(7) == "userMessageDetail") {
      this.isType = "userMessage";
    } else if (
      this.$route.path.substring(1).slice(7) == "certificateManagement" ||
      this.$route.path.substring(1).slice(7) == "issueCertificate" ||
      this.$route.path.substring(1).slice(7) == "cerfityLook"
    ) {
      this.isType = "certificateManagement";
    } else if (
      this.$route.path.substring(1).slice(7) == "templateDetail" ||
      this.$route.path.substring(1).slice(7) == "templateEdit" ||
      this.$route.path.substring(1).slice(7) == "templateAdd"
    ) {
      this.isType = "templateManagement";
    } else if (this.$route.path.substring(1).slice(7) == "permission") {
      this.isType = "accountManagement";
    } else if (this.$route.path.substring(1).slice(7) == "accountList") {
      this.isType = "accountManagement";
    } else if (
      this.$route.path.substring(1).slice(7) == "department" ||
      this.$route.path.substring(1).slice(7) == "departmentList"
    ) {
      this.isType = "department";
    } else {
      this.isType = this.$route.path.substring(1).slice(7);
    }
    this.routeType = this.$route.path.substring(1).slice(7);

    this.getUserInfo("init");
    // 此方法放到了getuserinfo里
    // this.permissionArr = JSON.parse(sessionStorage.getItem("user")).roles[0].permissions;
    // this.perModel = JSON.parse(sessionStorage.getItem("permissionModel"));
  },
  updated() {
    if (this.$route.path.substring(1).slice(7) == "userDetail") {
      this.isType = "userManagement";
    } else if (this.$route.path.substring(1).slice(7) == "userMessageDetail") {
      this.isType = "userMessage";
    } else if (
      this.$route.path.substring(1).slice(7) == "certificateManagement" ||
      this.$route.path.substring(1).slice(7) == "issueCertificate" ||
      this.$route.path.substring(1).slice(7) == "cerfityLook" ||
      this.$route.path.substring(1).slice(7) == "batchIssue"
    ) {
      this.isType = "certificateManagement";
    } else if (
      this.$route.path.substring(1).slice(7) == "templateDetail" ||
      this.$route.path.substring(1).slice(7) == "templateEdit" ||
      this.$route.path.substring(1).slice(7) == "templateAdd" ||
      this.$route.path.substring(1).slice(7) == "templateHistory"
    ) {
      this.isType = "templateManagement";
    } else if (this.$route.path.substring(1).slice(7) == "permission") {
      this.isType = "accountManagement";
    } else if (this.$route.path.substring(1).slice(7) == "accountList") {
      this.isType = "accountManagement";
    } else if (
      this.$route.path.substring(1).slice(7) == "department" ||
      this.$route.path.substring(1).slice(7) == "departmentList"
    ) {
      this.isType = "department";
    } else {
      this.isType = this.$route.path.substring(1).slice(7);
    }
    this.routeType = this.$route.path.substring(1).slice(7);
  },
};
</script>
<style>
p {
  font-size: 0.7rem;
}
.p1 {
  font-size: 0.9rem;
}
.p2 {
  text-indent: -1.25rem;
  margin-left: 1.25rem;
}
.p2_ {
  text-indent: -0.625rem;
  margin-left: 1.775rem;
}
.p3 {
  text-indent: -1.75rem;
  margin-left: 3.125rem;
}
.p4 {
  text-indent: -2.25rem;
  margin-left: 5.75rem;
}
.protocal_dia .el-dialog__body {
  padding: 6px 20px;
}
.updataPwd .el-dialog__body {
  padding: 1.3rem 1.5rem 0;
}
.updataPwd .el-button {
  padding: 0.6rem 1rem;
  font-size: 0.7rem;
}
.updataPwd .el-form-item__label {
  font-size: 0.7rem;
}
.protocal_dia .el-dialog__footer {
  text-align: left !important;
}
.protocalBox {
  font-size: 0.7rem;
  font-weight: 400;
  text-align: left;
  color: #363636;
  line-height: 1.2rem;
}

.protocalBox::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: rgba(0, 255, 255, 0);
}

.protocalBox:hover::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: rgba(255, 255, 255, 0);
}

/*定义滚动条轨道 内阴影+圆角*/
.protocalBox::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 255, 255, 0);
  border-radius: 10%;
  background-color: rgba(255, 255, 255, 0);
}

/*定义滚动条轨道 内阴影+圆角*/
.protocalBox::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 255, 255, 0);
  border-radius: 10%;
  background-color: rgba(255, 255, 255, 0);
}

/*定义滑块 内阴影+圆角*/
.protocalBox::-webkit-scrollbar-thumb {
  border-radius: 10%;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
  background-color: rgba(0, 0, 0, 0.4);
}

/*  */
#rose-layout .app_down_label {
  height: 30px;
  margin-right: 2rem;
  position: relative;
}
#rose-layout .app_down_labelText {
  line-height: 30px;
  font-size: 0.7rem;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: justify;
  color: #f76a0d;
  cursor: pointer;
}
#rose-layout .app_down_labelQrcode::after {
  position: absolute;
  content: "";
  top: -19px;
  left: 50%;
  transform: translateX(-50%);
  border-top: 10px transparent dashed;
  border-left: 10px transparent dashed;
  border-bottom: 10px #fff dashed;
  border-right: 10px transparent dashed;
  /* box-shadow: 0px 1px 12px 0px rgba(75, 75, 72, 1), 0px 0px 0px 0px rgba(255,255,255,1); */
}
#rose-layout .qrcode {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 8rem;
  height: 8rem;
  background: url("../assets/img/qrcode.png") center no-repeat;
  background-size: cover;
}
#rose-layout .app_down_labelQrcode {
  position: absolute;
  z-index: 9999;
  left: 50%;
  transform: translateX(-50%);
  top: 2rem;
  box-shadow: 0px 1px 12px 0px rgba(75, 75, 72, 0.5),
    0px 0px 0px 0px rgba(255, 255, 255, 0.5);
  background-color: #ffffff;
  width: 9rem;
  height: 11rem;
  text-align: center;
  padding: 1rem 0.5rem 1rem 1rem;
  display: none;
  border: 1px solid #ecf0f1;
  border-radius: 0.75rem;
}
#rose-layout .app_down_label:hover .app_down_labelQrcode {
  display: block;
}
#rose-layout .app_d_label_desc {
  text-align: center;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: #848484;
  font-size: 0.8rem;
  width: 100%;
}
.el-popover__title {
  margin: 0.5rem 0.5rem;
}
.serchCondition .el-input {
  width: 13.9rem;
}

#rose-layout .el-date-editor .el-range-separator {
  padding: 0 0.25rem;
  line-height: 1.6rem;
}

#rose-layout .el-select > .el-input {
  height: 2rem;
  width: 100%;
}

#rose-layout .el-select .el-input__inner {
  padding-right: 1.75rem;
}

#rose-layout .el-input__inner {
  height: 2rem;
  line-height: 2rem;
  font-size: 0.7rem;
}

#rose-layout .el-input .el-input__icon {
  line-height: 2rem;
}

#rose-layout .el-input--prefix .el-input__inner {
  padding-left: 1.5rem;
}
#rose-layout .el-range-editor .el-range-input {
  font-size: 0.7rem;
}
#rose-layout .el-form-item--mini .el-form-item__label {
  font-size: 0.7rem;
  line-height: 2rem;
}
#rose-layout .el-dialog__footer {
  text-align: left;
}
</style>
<style scoped lang="scss">
@import "./index";
</style>
