<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-select
              v-model="formInline.orderStatusArray"
              multiple
              clearable
              collapse-tags
              placeholder="全部订单状态"
            >
              <el-option
                v-for="item in ordstatuslist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="formInline.allocateCargoStatus"
              multiple
              clearable
              collapse-tags
              placeholder="拣货状态"
            >
              <!-- <el-option label="初始化" value="0"></el-option> -->
              <el-option label="待拣货" value="1"></el-option>
              <el-option label="已拣货" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-input
              v-model="formInline.keys"
              placeholder="订单编号/物流单号/免税袋条码/纸箱条码/收货人手机号"
              class="input_search"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="formInline.deta"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="onSubmit()">查询</el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-download"
              @click="Export('formInline')"
              v-permission
              permission-method="GET"
              permission-taskCode="/admin/order/export"
            >订单导出</el-button>
            <el-button
              size="mini"
              class="filter-item"
              type="primary"
              icon="el-icon-download"
              @click="shipbillImport"
              :loading="downloadLoading"
              v-permission
              permission-method="GET"
              permission-taskCode="/admin/order/admin/order/import/waybill"
            >运单导入</el-button>
            <el-button type="text" v-show="daochushow" @click="daochushow=false">
              收缩
              <i class="el-icon-arrow-up"></i>
            </el-button>
            <el-button type="text" v-show="!daochushow" @click="daochushow=true">
              展开
              <i class="el-icon-arrow-down"></i>
            </el-button>
          </el-form-item>
        </el-form>
        <daochu v-show="daochushow"></daochu>
      </div>
      <div>
        <div v-if="tableData.length>0" style="height:calc(100vh - 340px);overflow: auto;">
          <el-card v-for="(item,index) in tableData" :key="index" :body-style="{padding:0}">
            <div class="text item">
              <el-table
                :data="[item]"
                style="width: 100%;color:#333333"
                :row-style="{background:'#E6F7FF'}"
                :show-header="false"
              >
                <el-table-column prop="orderSn">
                  <template slot-scope="scope">订单编号:{{scope.row.orderSn}}</template>
                </el-table-column>
                <el-table-column prop="addTime" align="center">
                  <template slot-scope="scope">下单时间:{{scope.row.addTime}}</template>
                </el-table-column>
                <el-table-column prop="payTime" align="center">
                  <template slot-scope="scope">支付时间:{{scope.row.payTime}}</template>
                </el-table-column>
              </el-table>
              <el-table
                :data="[item]"
                style="width: 100%;color:#333333"
                :show-header="false"
                border
              >
                <el-table-column prop="orderSn" width="300px;" class-name="celsl">
                  <template slot-scope="scope">
                    <p
                      v-for="(goods,index) in scope.row.orderGoodsDtos"
                      :key="index"
                      style="padding-left: 10px; padding-right: 10px;"
                      :class="scope.row.orderGoodsDtos.length>1&&scope.row.orderGoodsDtos.length!=index+1?'goodsbottom':''"
                    >
                      <el-row>
                        <el-col :span="10">
                          <img :src="goods.picUrl" alt style="width:100px;height:100px" />
                        </el-col>
                        <el-col :span="14">
                          <el-col :span="24">{{goods.goodsName}}</el-col>
                          <el-col :span="24">数量:{{goods.number}}</el-col>
                        </el-col>
                      </el-row>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column prop="addTime">
                  <template slot-scope="scope">
                    <p>收件人:{{scope.row.consignee}}{{scope.row.mobile}}</p>
                    <p>
                      收件地址：
                      <span>{{scope.row.address}}</span>
                    </p>
                    <p>身份证号:{{scope.row.receiverPersonCard}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="payTime">
                  <template slot-scope="scope">
                    <p>订单金额:￥{{scope.row.orderPrice}}</p>
                    <p>支付金额:￥{{scope.row.actualPrice}}</p>
                    <p>其中：税费：￥{{scope.row.taxPrice}} 运费:￥{{scope.row.freightPrice}}</p>
                    <p>支付方式:{{statusFilter(scope.row.transferId,'transfer').name}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="payTime" align="center">
                  <template slot-scope="scope">
                    <p>{{statusFilter(scope.row.orderStatus,'ordstatuslist').name}}</p>
                    <p>
                      <el-button type="text" @click="detailsHandle(scope.row.id)">订单详情</el-button>
                    </p>
                    <p
                      v-permission
                      permission-method="POST"
                      permission-taskCode="/admin/order/orderClose"
                    >
                      <el-button
                        type="text"
                        v-if="scope.row.orderStatus==201&&scope.row.allocateCargoStatus==1"
                        @click="orderclose(scope.row.id)"
                      >关闭交易</el-button>
                    </p>
                    <p v-if="scope.row.orderStatus==201||scope.row.orderStatus==204">
                      <el-tag
                        type="warning"
                        style="color:#fff"
                        :color="statusFilter(scope.row.allocateCargoStatus,'allocateCargoStatuslist').color"
                      >{{statusFilter(scope.row.allocateCargoStatus,'allocateCargoStatuslist').name}}</el-tag>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column prop="payTime">
                  <template slot-scope="scope">
                    <p>
                      物流单号:
                      <span>{{scope.row.shipSn}}</span>
                    </p>
                    <p>
                      免税条码:
                      <span>{{scope.row.freeTaxBarCode}}</span>
                    </p>
                    <p>
                      纸箱条码:
                      <span>{{scope.row.cartonBoxBarCode}}</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column prop="payTime" align="center">
                  <template slot-scope="scope">
                    <p
                      v-permission
                      permission-method="POST"
                      permission-taskCode="/admin/order/makePackBarCode"
                    >
                      <el-button
                        type="primary"
                        size="mini"
                        @click="enterBarcodesHandle(scope.row)"
                        v-if="scope.row.allocateCargoStatus==2&&(scope.row.orderStatus==201||scope.row.orderStatus==204)"
                      >录入免税袋纸箱条码</el-button>
                    </p>
                    <p
                      v-if="scope.row.orderStatus==201&&scope.row.allocateCargoStatus==1"
                      v-permission
                      permission-method="POST"
                      permission-taskCode="/admin/order/pickUp"
                    >
                      <el-button
                        type="primary"
                        size="mini"
                        @click="pickListImport('拣货入库',scope.row)"
                      >拣货入库</el-button>
                    </p>
                    <p
                      v-if="(scope.row.orderStatus==201||scope.row.orderStatus==204)&&scope.row.freeTaxBarCode"
                      v-permission
                      permission-method="POST"
                      permission-taskCode="/admin/order/ship"
                    >
                      <el-button
                        type="primary"
                        size="mini"
                        @click="deliverGoodsHandle(scope.row)"
                      >发货</el-button>
                    </p>
                    <p
                      v-if="scope.row.shoppingReceipts && scope.row.shoppingReceipts == -1"
                      v-permission
                      permission-method="POST"
                      permission-taskCode="/admin/order/updateShoppingReceipts"
                    >
                      <el-button type="primary" size="mini" @click="upimg(scope.row)">上传购物小票</el-button>
                    </p>
                    <p v-if="scope.row.shoppingReceipts && scope.row.shoppingReceipts != -1">
                      <el-button type="primary" size="mini" @click="openimage(scope.row)">查看购物小票</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
        <p v-else style="text-align: center;">暂无数据</p>
        <div class="block" style="text-align:center; margin-top:2em">
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <!-- 弹出框 -->
    </el-card>

    <el-dialog title="预览小票" :visible.sync="imagedialogVisible" width="500px">
      <el-image :src="imageopenurl" fit="contain"></el-image>
    </el-dialog>
    <el-dialog
      title="运单导入"
      :visible.sync="shipbillDialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="shipbillImportForm"
        :rules="shipbillImportRules"
        :model="shipbillImportForm"
        status-icon
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="清关公司" prop="company" labelWidth="150px">
          <el-select
            v-model="shipbillImportForm.company"
            placeholder="请选择"
            filterable
            style="width: 300px"
          >
            <el-option key="1" label="广州跨境云" value="gzkjy"></el-option>
            <el-option key="2" label="永利八达通" value="ylbdt"></el-option>
            <el-option key="3" label="和程" value="hc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件" prop="company" labelWidth="150px">
          <input
            type="file"
            ref="upload"
            accept=".xls, .xlsx, .csv"
            id="uploadInput"
            @change="readExcel($event)"
          />
          <!--<el-upload class="upload-demo" action="" :on-change="readExcel" :limit="1" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" :auto-upload="false">
						<el-button size="small" type="primary">点击上传</el-button>
          </el-upload>-->
        </el-form-item>
        <div></div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelShipbillImport">取消</el-button>
        <el-button type="primary" @click="confirmShipbillImport">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="上传购物小票" :visible.sync="upimagedialogVisible" width="400px">
      <el-form
        ref="upimagefrom"
        :rules="rules"
        :model="upimagefrom"
        status-icon
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="购物小票" prop="shoppingReceipts" labelWidth="150px">
          <avatarUpload
            :url="upimagefrom.shoppingReceipts"
            @change="changeImg1($event,'shoppingReceipts')"
          ></avatarUpload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="upimagedialogVisible=false">取消</el-button>
        <el-button type="primary" @click="uolodeimg('upimagefrom')">确定</el-button>
      </div>
    </el-dialog>

    <!-- 拣货入库对话框 -->
    <el-dialog :title="alltitle" :visible.sync="pickImportDialogVisible">
      <el-form
        ref="pickImportForm"
        :rules="pickImportRules"
        :model="pickImportForm"
        status-icon
        label-position="left"
        label-width="150px"
        style="width: 600px;"
      >
        <el-form-item label="订单号" prop="orderNumber">
          <!-- <el-input
            v-model="pickImportForm.orderNumber"
            style="width: 300px"
            ref="gain"
            autofocus="autofocus"
          ></el-input>-->
          {{pickImportForm.orderNumber}}
        </el-form-item>
        <el-form-item label="购物小票" v-if="alltitle == '拣货入库'">
          <avatarUpload
            :url="pickImportForm.shoppingReceipts"
            @change="changeImgs($event,'shoppingReceipts')"
          ></avatarUpload>
        </el-form-item>
        <el-table :data="pickImportForm.list" border>
          <el-table-column prop="goodsName" align="center" label="商品名称"></el-table-column>
          <el-table-column prop="picUrl" align="center" label="商品图片">
            <template slot-scope="scope">
              <img :src="scope.row.picUrl" alt style="width:50px;height:50px" />
            </template>
          </el-table-column>
          <el-table-column prop="number" align="center" label="商品数量"></el-table-column>
          <el-table-column prop="purchasePrice" label="商品价格">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.purchasePrice"
                ref="gain"
                autofocus="autofocus"
                placeholder="请输入采购成本"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelPickImport">取消</el-button>
        <el-button type="primary" @click="confirmPickImport('pickImportForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="录入免税袋纸箱条码"
      :visible.sync="enterBarcodesDialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="enterBarcodesForm"
        :rules="enterBarcodesRules"
        :model="enterBarcodesForm"
        status-icon
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="订单编号" prop="orderNum" labelWidth="150px">{{enterBarcodesForm.orderNum}}</el-form-item>
        <el-form-item label="纸箱条码" prop="cartonBoxBarCode" labelWidth="150px">
          <el-input
            @keyup.enter.native="boxCodeChange"
            v-model="enterBarcodesForm.cartonBoxBarCode"
            style="width: 300px"
            ref="cartonBoxInput"
            autofocus="autofocus"
          ></el-input>
        </el-form-item>
        <el-form-item label="免税袋条码" prop="freeTaxBarCode" labelWidth="150px">
          <el-input v-model="enterBarcodesForm.freeTaxBarCode" style="width: 300px" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEnterBarcodes">取消</el-button>
        <el-button type="primary" @click="confirmEnterBarcodes">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="jieDialogVisible" title="截图" width="410px">
      <el-checkbox v-model="godssall">商品合计</el-checkbox>
      <el-checkbox v-model="yunfei">运费</el-checkbox>
      <el-checkbox v-model="shuifei">税费</el-checkbox>
      <el-checkbox v-model="shifu">实付</el-checkbox>
      <div id="capture" ref="imageTofile">
        <div style="background:#F7CF20">
          <p style="height: 40px;line-height: 40px;margin:0;padding: 0 15px;">
            <span
              style="font-weight: bold;color:#000;margin-left: 5px;"
            >{{new Date().getHours()}}:{{new Date().getMinutes().toString().length==1?'0'+new Date().getMinutes():new Date().getMinutes()}}</span>
            <i class="iconfont icon-iconset0250" style="font-size: 24px;float: right;color:#000;"></i>
            <span style="font-weight: bold;color:#000;float: right;margin-right: 5px;">4G</span>
            <i
              class="iconfont icon-IOTtubiao_huabanfuben"
              style="font-size: 2px;float: right;color:#000;margin-right: 5px;"
            ></i>
          </p>
          <!-- <van-nav-bar style="background:#F7CF20">
            <span slot="title">
              <span style="font-weight: bold">小蜜蜂电商</span>
            </span>
            <span slot="left">
              <van-icon name="cross" size="18" />
            </span>
            <span slot="right">
              <span class="iconfont icon-gengduo" style="font-size: 24px;"></span>
            </span>
          </van-nav-bar>-->
        </div>
        <van-nav-bar left-arrow style="background:#F7CF20;color:#333333">
          <span slot="title">
            <span style="color:#333333">订单详情</span>
          </span>
        </van-nav-bar>
        <div style="height:100px;background:#F7CF20;">
          <span
            style="padding-top: 20px;display: block;padding-left: 20px;font-size: 24px;color: #333;"
          >{{statusFilter(orderDetail.orderRespDto.orderStatus,'ordstatuslist').name}}</span>
        </div>
        <div>
          <van-cell-group>
            <div class="order-address-bar side-distance" style="padding: 0 14px;color:#333333">
              <div class="order-address-box">
                <!-- <div class="icon-box">
                <icon scale="2" name="gpr"></icon>
                </div>-->
                <div class="content-box">
                  <p class="user-box">
                    <span>
                      <span>{{orderDetail.orderRespDto.shipChannel}}</span>
                      ：{{activities[0].context}}
                    </span>
                  </p>
                  <p class="address-box">{{activities[0].time}}</p>
                </div>
                <div class="icon-box">
                  <van-icon name="arrow" style="font-size: 19px;height: 29px;margin-left: 8px;" />
                </div>
              </div>
            </div>
            <!-- <van-cell is-link :title="orderDetail.orderRespDto.shipChannel+activities[0].context" :value="orderDetail.orderRespDto.shipSn" :label="activities[0].time" /> -->
            <!-- <div class="order-detail-status">
            <b>{{statusFilter(orderDetail.orderRespDto.orderStatus,'ordstatuslist').name}}</b>
            <slot></slot>
          </div>
          <van-cell title="下单时间：" :value="orderDetail.orderRespDto.addTime" />
            <van-cell title="订单编号：" :value="orderDetail.orderRespDto.orderSn" />-->
            <!-- <van-cell title="快递单号:" :value="orderDetail.orderRespDto.shipSn" />
            <van-cell title="快递公司:" :value="orderDetail.orderRespDto.shipChannel" />-->
            <!-- <van-cell title="收货人：" :value="orderDetail.orderRespDto.consignee" />
          <van-cell title="收货人电话：" :value="orderDetail.orderRespDto.mobile" />
            <van-cell title="收货地址：" :value="orderDetail.orderRespDto.address" />-->

            <div class="order-address-bar side-distance" style="padding: 0 14px;">
              <div class="order-address-box">
                <div class="content-box">
                  <p class="user-box">
                    <span>收货人：{{orderDetail.orderRespDto.consignee}}</span>
                    <span>{{orderDetail.orderRespDto.mobile}}</span>
                  </p>
                  <p class="address-box">收货地址：{{orderDetail.orderRespDto.address}}</p>
                </div>
              </div>
            </div>
            <div style="background:#eee;height:5px"></div>
            <div class="order-detail-goods">
              <div class="m-t-10 item">
                <a
                  href="javascript:void(0);"
                  class="product-box com-top-1px"
                  v-for="(item,index) in orderDetail.orderGoodsRespDtoList"
                  :key="index"
                >
                  <img :src="main(item.picUrl,item.id)" style="display:none" />
                  <img :src="base64s(item.id)" />
                  <div class="left" style="width: 100%;">
                    <p style="height: 50px;">{{item.goodsName}}</p>
                    <p style="margin-top: 28px;">
                      HK${{item.priceall}}
                      <small style="float:right">共{{item.number}}件</small>
                    </p>
                  </div>
                </a>
                <!-- <p class="row">实付</p> -->
                <van-cell
                  v-if="godssall"
                  title="商品总额:"
                  :value="'HK$'+ orderDetail.orderRespDto.goodsPrice "
                />
                <van-cell
                  v-if="shuifei"
                  title="税费:"
                  :value="'HK$'+ orderDetail.orderRespDto.taxPrice  "
                />
                <van-cell
                  v-if="yunfei"
                  title="运费:"
                  :value="'HK$'+ orderDetail.orderRespDto.freightPrice "
                />
                <van-cell v-if="shifu" title="实付金额:">
                  <template slot="title">
                    <span style="font-size:16px;color:#333333">实付金额:</span>
                  </template>

                  <template slot="default">
                    <span style="color:red">
                      HK${{orderDetail.orderRespDto.actualPrice
                      }}
                    </span>
                  </template>
                </van-cell>
              </div>
            </div>
            <div style="background:#eee;height:5px"></div>
            <div>
              <p style="padding: 10px 15px;margin: 0px;color: #333">
                订单来源:
                <span style="margin-left: 10px;">小蜜蜂电商</span>
              </p>
              <p style="padding: 10px 15px;margin: 0px;color: #333">
                订单编号:
                <span style="margin-left: 10px;">{{orderDetail.orderRespDto.orderSn}}</span>
              </p>
              <p style="padding: 10px 15px;margin: 0px;color: #333">
                支付方式:
                <span
                  style="margin-left: 10px;"
                >{{statusFilter(orderDetail.orderRespDto.transferId,'transfer').name}}</span>
              </p>
              <p style="padding: 10px 15px;margin: 0px;color: #333">
                物流公司:
                <span style="margin-left: 10px;">{{orderDetail.orderRespDto.shipChannel}}</span>
              </p>
              <p style="padding: 10px 15px;margin: 0px;color: #333">
                快递单号:
                <span style="margin-left: 10px;">{{orderDetail.orderRespDto.shipSn}}</span>
              </p>
              <p style="padding: 10px 15px;margin: 0px;color: #333">
                下单时间:
                <span style="margin-left: 10px;">{{orderDetail.orderRespDto.addTime}}</span>
              </p>
              <p style="padding: 10px 15px;margin: 0px;color: #333">
                发货时间:
                <span style="margin-left: 10px;">{{orderDetail.orderRespDto.shipTime}}</span>
              </p>
            </div>
            <div class="btns">
              <van-button type="primary" color="#ffdf00" size="mini">确认收货</van-button>
            </div>
          </van-cell-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="plccun()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 订单详情对话框 -->
    <el-dialog
      class="orderDetailBody"
      title="订单详情"
      width="1080px"
      :visible.sync="orderDialogVisible"
      center
    >
      <el-form :data="orderDetail" label-position="left">
        <div>
          <div class="order-box">
            <span style="flex:0 0 250px">
              订单编号：{{ orderDetail.orderRespDto.orderSn }}
              <!-- （下单时间{{orderDetail.order.addTime}}） -->
            </span>
            <span style="flex:0 0 230px">订单时间：{{ orderDetail.orderRespDto.addTime }}</span>
            <div>
              <span class="user-name-box">用户：{{ orderDetail.userDto.mobile }}</span>
              <el-tag>{{ statusFilter(orderDetail.orderRespDto.orderStatus,'ordstatuslist').name}}</el-tag>
            </div>
          </div>
          <div class="order-title-box">
            <div class="order-title-item">支付人实名:{{ orderDetail.orderRespDto.realName }}</div>
            <div class="order-title-item">支付人身份证号:{{ orderDetail.orderRespDto.receiverPersonCard }}</div>
          </div>
          <el-table
            size="small"
            show-summary
            :data="orderDetail.orderGoodsRespDtoList"
            border
            fit
            highlight-current-row
            :summary-method="getSummaries"
          >
            <el-table-column align="center" label="商品名称" prop="goodsName" />
            <el-table-column align="center" label="商品编号" prop="goodsSn" />
            <el-table-column align="center" label="商品规格" prop="specifications" />
            <el-table-column align="center" label="商品售价" prop="price" />
            <el-table-column align="center" label="商品税费" prop="incomeTax" />
            <el-table-column align="center" label="商品数量" prop="number" />
            <el-table-column align="center" label="商品总价" prop="priceall" />
            <el-table-column align="center" label="商品税费小计" prop="incomeTaxall">
              <template slot-scope="scope">
                <span>{{scope.row.incomeTaxall}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="实际采购价格" prop="purchasePrice">
              <template slot-scope="scope">
                <el-button type="text" @click="updatepic(scope.row)">{{scope.row.purchasePrice||0}}</el-button>
                <el-popover
                  placement="top"
                  trigger="hover"
                  v-if="orderDetail.orderRespDto.shoppingReceipts&&orderDetail.orderRespDto.shoppingReceipts!=-1"
                >
                  <i class="el-icon-view" slot="reference"></i>
                  <img
                    :src="orderDetail.orderRespDto.shoppingReceipts"
                    style="width: 500px;display: block"
                  />
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品图片" prop="picUrl">
              <template slot-scope="scope">
                <img :src="scope.row.picUrl" width="40" />
              </template>
            </el-table-column>
          </el-table>

          <div class="section-box order-title-box">
            <div class="order-title-item">运单报关信息</div>
          </div>
          <el-table size="small" :data="orderDetail.Waybill" border fit highlight-current-row>
            <!--<el-table-column align="center" label="快递公司" prop="shipChannel" />-->
            <!--<el-table-column align="center" label="物流运单编号" prop="shipSn" />-->
            <el-table-column align="center" label="保价费" prop="valuationFee" />
            <el-table-column align="center" label="提运单号" prop="mentionAwb" />
            <el-table-column align="center" label="运输方式代码" prop="transportation" />
            <el-table-column align="center" label="运输工具名称" prop="transport" />
            <el-table-column align="center" label="包装种类代码" prop="packingType" />
            <el-table-column align="center" label="发货人所在国家代码" prop="shipperCountry" />
            <el-table-column align="center" label="收货人行政区代码" prop="receiverAdCode" />
          </el-table>

          <!-- <div class="order-title-bottom">
            <div class="order-title-item">
              用户：{{ orderDetail.user.userName }}
            </div>
          </div>-->
        </div>
        <div class="section-box" v-if="orderDetail.orderRespDto.remark ">
          <h4 class="title-box-left">拒绝退款原因:</h4>
          <div class="content-box">
            <p>
              <span style="color:red">{{ orderDetail.orderRespDto.remark }}</span>
            </p>
          </div>
        </div>
        <div class="section-box">
          <h4 class="title-box-left">买家留言:</h4>
          <div class="content-box">
            <p>
              <span>{{ orderDetail.orderRespDto.leavingMessage }}</span>
            </p>
          </div>
        </div>
        <div class="section-box">
          <h4 class="title-box-left">收货信息:</h4>
          <div class="content-box">
            <p class="line-box">
              <span class="item-box">收货人：{{ orderDetail.orderRespDto.consignee }}</span>
              <span class="item-box">手机号：{{ orderDetail.orderRespDto.mobile }}</span>
            </p>
            <p>
              <span>地址：{{ orderDetail.orderRespDto.address }}</span>
            </p>
          </div>
        </div>
        <div class="section-box">
          <h4 class="title-box-left">费用信息:</h4>
          <div class="content-box">
            <table class="price-table el-table__body">
              <tr>
                <th>币种</th>
                <th>商品总价</th>
                <th>快递费用</th>
                <th>税费</th>
                <th>优惠减免</th>
                <th>积分减免</th>
                <th>实际费用</th>
                <th>下单汇率</th>
              </tr>
              <tr>
                <td>港币</td>
                <td>+ {{ orderDetail.orderRespDto.goodsPrice }}元</td>
                <td>+ {{ orderDetail.orderRespDto.freightPrice }}元</td>
                <td>+ {{ orderDetail.orderRespDto.taxPrice }}元</td>
                <td>- {{ orderDetail.orderRespDto.couponPrice }}元</td>
                <td>- {{ orderDetail.orderRespDto.integralPrice }}元</td>
                <td>
                  =
                  <span class="red-text">{{ orderDetail.orderRespDto.actualPrice }}元</span>
                </td>
                <td>
                  1HKD ≈
                  <span style="color:red">{{ orderDetail.orderRespDto.exchangeRate}}</span>CNY
                </td>
              </tr>
              <tr>
                <td>人民币</td>
                <td>+ {{ (orderDetail.orderRespDto.goodsPrice*orderDetail.orderRespDto.exchangeRate).toFixed(2) }}元</td>
                <td>+ {{ (orderDetail.orderRespDto.freightPrice*orderDetail.orderRespDto.exchangeRate).toFixed(2) }}元</td>
                <td>+ {{ (orderDetail.orderRespDto.taxPrice*orderDetail.orderRespDto.exchangeRate).toFixed(2) }}元</td>
                <td>- {{ (orderDetail.orderRespDto.couponPrice*orderDetail.orderRespDto.exchangeRate).toFixed(2) }}元</td>
                <td>- {{ (orderDetail.orderRespDto.integralPrice*orderDetail.orderRespDto.exchangeRate).toFixed(2) }}元</td>
                <td>
                  =
                  <span
                    class="red-text"
                  >{{ (orderDetail.orderRespDto.actualPrice*orderDetail.orderRespDto.exchangeRate).toFixed(2) }}元</span>
                </td>
                <td>
                  1CNY ≈
                  <span
                    style="color:red"
                  >{{ (1/orderDetail.orderRespDto.exchangeRate).toFixed(4)}}</span>HKD
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="section-box">
          <h4 class="title-box-left">支付信息:</h4>
          <div class="content-box">
            <p class="line-box">
              <span
                class="item-box"
              >支付渠道：{{statusFilter(orderDetail.orderRespDto.transferId,'transfer').name }}</span>
              <!-- <span class="item-box">支付渠道：{{ orderDetail.order.transId }}</span> -->
              <span class="item-box">支付时间：{{ orderDetail.orderRespDto.payTime }}</span>
            </p>
          </div>
        </div>
        <div class="section-box">
          <h4 class="title-box-left">快递信息:</h4>
          <div class="content-box">
            <p class="line-box">
              <span class="item-box">快递公司：{{ orderDetail.orderRespDto.shipChannel }}</span>
              <span class="item-box">发货时间：{{ orderDetail.orderRespDto.shipTime }}</span>
              <span class="item-box">签收时间：{{ orderDetail.orderRespDto.expressConfirmTime }}</span>
            </p>
            <p class="line-box">
              <span class="item-box">快递单号：{{ orderDetail.orderRespDto.shipSn }}</span>
              <el-button
                type="text"
                @click="queryTracklist(orderDetail.orderRespDto.id)"
                v-if="orderDetail.orderRespDto.orderStatus==301||orderDetail.orderRespDto.orderStatus==402||orderDetail.orderRespDto.orderStatus==409||orderDetail.orderRespDto.orderStatus==401"
              >物流信息</el-button>
            </p>
          </div>
        </div>
        <div class="section-box">
          <h4 class="title-box-left">收货信息:</h4>
          <div class="content-box">
            <p>
              <span class="item-box">确认收货时间：{{ orderDetail.orderRespDto.confirmTime }}</span>
            </p>
          </div>
        </div>
        <div class="section-box order-title-box" v-if="orderDetail.orderRespDto.orderStatus==202">
          <div class="order-title-item">用户申请退款信息</div>
        </div>
        <el-table
          size="small"
          :data="orderDetail.refundInfoDtos"
          border
          fit
          highlight-current-row
          v-if="orderDetail.orderRespDto.orderStatus==202"
        >
          <el-table-column align="center" label="退款金额" prop="amount" />
          <el-table-column align="center" label="联系号码" prop="mobile" />
          <el-table-column align="center" label="退款原因" prop="reason" />
          <el-table-column align="center" label="申请退款图片" prop="picUrls">
            <template slot-scope="scope">
              <el-image
                v-if="scope.row.picUrls.length>0"
                style="width: 40px; height: 40px"
                :src="scope.row.picUrls[0]"
                :preview-src-list="scope.row.picUrls"
              ></el-image>
              <span v-else>无</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- <div class="section-box order-title-box">
            <div class="order-title-item"></div>
          </div>
        {{orderDetail}}-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="orderDetail.orderRespDto.orderStatus==202"
          type="primary"
          @click="onRefund(orderDetail.orderRespDto)"
          v-permission
          permission-method="POST"
          permission-taskCode="/admin/order/refund"
        >确认退款</el-button>
        <el-button
          v-if="orderDetail.orderRespDto.orderStatus==202"
          type="primary"
          @click="noRefund(orderDetail.orderRespDto)"
          v-permission
          permission-method="PUT"
          permission-taskCode="/admin/order/cancelRefund"
        >拒绝退款</el-button>
        <el-button
          type="primary"
          @click="jie()"
          v-if="orderDetail.orderRespDto.orderStatus==301||orderDetail.orderRespDto.orderStatus==402||orderDetail.orderRespDto.orderStatus==409||orderDetail.orderRespDto.orderStatus==401"
        >截图</el-button>
        <!-- <el-button
          v-if=" orderDetail.orderRespDto.orderStatus==204"
          type="primary"
          @click="onRefundSearch(orderDetail.orderRespDto)"
        >申请退款</el-button>-->
        <!-- <el-button
          v-if="orderDetail.orderRespDto.orderStatus==209"
          type="primary"
          @click="onRefundSearch(orderDetail.orderRespDto)"
        >退款查询</el-button>-->
      </div>
    </el-dialog>
    <el-dialog title="物流信息" :visible.sync="queryTrackdialogVisible" width="30%">
      <div style="overflow: auto;
    height: 500px;
    padding: 5px;">
        <el-timeline v-if="activities.length>0">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
        <span v-else>暂无物流信息，请隔段时间再查</span>
      </div>
    </el-dialog>
    <!-- 发货对话框 -->
    <el-dialog
      title="发货"
      :visible.sync="shipDialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="shipForm"
        :rules="shiprules"
        :model="shipForm"
        status-icon
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="快递公司" prop="shipChannel" labelWidth="150px">
          <el-input v-model="shipForm.shipChannel" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="物流运单编号" prop="shipSn" labelWidth="150px">
          <el-input v-model="shipForm.shipSn" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="保价费" prop="valuationFee" labelWidth="150px">
          <el-input v-model="shipForm.valuationFee" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="提运单号" prop="mentionAwb" labelWidth="150px">
          <el-input v-model="shipForm.mentionAwb" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="运输方式代码" prop="transportation" labelWidth="150px">
          <el-select
            v-model="shipForm.transportation"
            placeholder="请选择"
            filterable
            style="width: 300px"
          >
            <el-option
              v-for="item in transportationType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运输工具名称" prop="transport" labelWidth="150px">
          <el-input v-model="shipForm.transport" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="包装种类代码" prop="packingType" labelWidth="150px">
          <el-select
            v-model="shipForm.packingType"
            placeholder="请选择"
            filterable
            style="width: 300px"
          >
            <el-option
              v-for="item in packingType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货人所在国家代码" prop="shipperCountry" labelWidth="150px">
          <el-select
            v-model="shipForm.shipperCountry"
            placeholder="请选择"
            filterable
            style="width: 300px"
          >
            <el-option
              v-for="item in contry"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="航班批次号" prop="voyageNo" labelWidth="150px">
          <el-input v-model="shipForm.voyageNo" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelMode">取消</el-button>
        <el-button type="primary" @click="confirmShip">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  orderlist,
  shipOrder,
  detailOrder,
  makePackBarCode,
  pickUpImport,
  updateOrderGoodsPurchasePrice,
  updateShoppingReceipts,
  cancelRefund,
  orderexport,
  shipbillImport,
  orderClose,
  orderrefund,
  queryTrack,
} from "@/api/order";
import {
  filterColor,
  statusFilterQuery,
  statusFilter,
} from "@/utils/statusMixin.js";
import { dateFormat } from "@/utils/validate";
import statusFilterJson from "@/data/statusFilter.json";
import transportationType from "@/data/transportationType.json";
import packingType from "@/data/packingType.json";
import contry from "@/data/contry.json";
import citydata from "@/data/citydata.json";
import daochu from "./daochu";
import avatarUpload from "@/components/Upload/avatarUpload";
import html2canvas from "html2canvas";
export default {
  components: { avatarUpload, daochu },
  data() {
    return {
      formInline: { deta: [] },
      dialogVisible: false,
      dataList: [],
      godssall: true,
      yunfei: true,
      shuifei: true,
      shifu: true,
      activities: [{ context: "无数据", time: "无数据" }],
      pickImportDialogVisible: false,
      transportationType: transportationType,
      packingType: packingType,
      upimagedialogVisible: false,
      queryTrackdialogVisible: false,
      shipbillDialogVisible: false,
      base64: [],
      imagedialogVisible: false,
      downloadLoading: false,
      jieDialogVisible: false,
      daochushow: false,
      imageopenurl: "",
      contry: contry,
      shipDialogVisible: false,
      upimagefrom: {
        orderId: "",
        shoppingReceipts: "",
      },
      shipForm: {
        shipChannel: undefined,
        shipSn: undefined,
        valuationFee: "0",
        mentionAwb: undefined,
        transportation: undefined,
        transport: undefined,
        packingType: undefined,
        shipperCountry: undefined,
        shoppingReceipts: null,
        //航班批次号
        voyageNo: undefined,
        // receiverAdCode: undefined,
        provinceId: undefined,
        cityId: undefined,
        areaId: undefined,
        orderId: undefined,
        //				freeTaxBarCode: undefined,
        //				cartonBoxBarCode: undefined,
        code: "",
      },
      pickImportForm: {
        orderNumber: "",
        shoppingReceipts: "",
      },
      shipbillImportForm: {
        company: "",
      },
      alltitle: "",
      shiprules: {
        shipSn: [
          {
            required: true,
            message: "物流运单编号不能为空",
            trigger: "blur",
          },
        ],
        shipChannel: [
          {
            required: true,
            message: "快递公司不能为空",
            trigger: "blur",
          },
        ],
        shoppingReceipts: [
          {
            required: true,
            message: "请上传购物小票",
            trigger: "blur",
          },
        ],
      },
      pickImportRules: {
        orderNumber: [
          {
            required: true,
            message: "订单号不能为空",
            trigger: "blur",
          },
        ],
        shoppingReceipts: [
          {
            required: true,
            message: "请上传购物小票",
            trigger: "blur",
          },
        ],
      },
      shipbillImportRules: {
        company: [
          {
            required: true,
            message: "清关公司不能为空",
            trigger: "blur",
          },
        ],
      },
      orderDetail: {
        orderRespDto: {},
        userDto: { name: "" },
        orderGoods: [],
        orderGoodsRespDtoList: [],
        Waybill: [],
      },
      orderDialogVisible: false,
      transfer: statusFilterJson.orderPayChannel,
      allocateCargoStatuslist: statusFilterJson.allocateCargoStatus,
      enterBarcodesDialogVisible: false,
      enterBarcodesForm: {
        orderNum: "",
        orderId: "",
        freeTaxBarCode: "",
        cartonBoxBarCode: "",
      },
      enterBarcodesRules: {
        freeTaxBarCode: [
          {
            required: true,
            message: "免税袋条码不能为空",
            trigger: "blur",
          },
        ],
        cartonBoxBarCode: [
          {
            required: true,
            message: "纸箱条码不能为空",
            trigger: "blur",
          },
        ],
      },
      ordstatuslist: statusFilterJson.orderStatus,
      statuslist: [
        {
          key: "1",
          label: "通过",
        },
        {
          key: "2",
          label: "不通过",
        },
      ],
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dltitle: "",
      form: {
        id: "",
        status: "",
        picUrls: [],
      },
      rules: {
        status: [
          { required: true, message: "请选择审核状态", trigger: "blur" },
        ],
        shoppingReceipts: [
          { required: true, message: "购物小票不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    statusFilter(id, type) {
      if (id) {
        for (let index = 0; index < this[type].length; index++) {
          const element = this[type][index];
          if (id == element.id) {
            let data = {
              name: element.name,
              color: element.color,
            };
            return data;
          }
        }
      } else {
        let data = {
          name: "",
          color: "",
        };
        return data;
      }
    },
    queryTracklist(id) {
      queryTrack({ orderId: id }).then((response) => {
        this.queryTrackdialogVisible = true;
        if (response.data.tracks.length > 0) {
          this.activities = response.data.tracks;
        }
      });
    },
    orderclose(id) {
      this.$confirm("关闭交易, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          orderClose({ orderId: id }).then((response) => {
            console.log(response, "response");
            this.getList();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    changeImg1(val, type) {
      this.upimagefrom[type] = val;
    },
    readExcel(e) {
      var self = this;
      const files = e.target.files;
      this.excelFile = files[0];
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        //					try {
        const data = ev.target.result;
        const workbook = XLSX.read(data, {
          type: "binary",
        });
        const wsname = workbook.SheetNames[0]; // 取第一张表
        const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // 生成json表格内容

        //					};
        // 文件能够传多次
        this.$refs.upload.value = "";
        fileReader.readAsBinaryString(files[0]);
      };
    },
    cancelShipbillImport() {
      this.shipbillDialogVisible = false;
      this.$refs["shipbillImportForm"].resetFields();
    },
    confirmShipbillImport() {
      if (!this.shipbillImportForm.company) {
        MessageBox.alert("请选择清关公司", "警告", {
          confirmButtonText: "确定",
          type: "error",
        });
        return false;
      }
      if (!this.excelFile) {
        MessageBox.alert("请上传文件", "警告", {
          confirmButtonText: "确定",
          type: "error",
        });
        return false;
      }
      var form = new FormData(); // FormData 对象
      form.append("file", this.excelFile); // 文件对象
      form.append("type", this.shipbillImportForm.company);
      shipbillImport(form)
        .then((res) => {
          let data = res;
          if (data.errno == "0") {
            Message({
              message: "运单导入成功！",
              type: "success",
            });
            this.getList();
            this.shipbillDialogVisible = false;
            this.$refs["shipbillImportForm"].resetFields();
          }
        })
        .catch((error) => {
          Message({
            message: error.errmsg,
            type: "error",
          });
        });
    },
    shipbillImport() {
      this.shipbillDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["shipbillImportForm"].clearValidate();
      });
    },
    Export(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let beginTime = "";
          let endTime = "";
          if (this.formInline.deta.length > 0) {
            beginTime = this.dateFormats(this.formInline.deta[0]);
            endTime = this.dateFormats(this.formInline.deta[1]);
          }
          const param = {
            orderStatusArray: this.formInline.orderStatusArray,
            keys: this.formInline.keys,
            beginTime: beginTime,
            endTime: endTime,
            page: this.pageNum,
            size: this.pageSize,
          };
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          orderexport(param)
            .then((response) => {
              const blob = new Blob([response]);
              console.log(blob);
              const fileName = "订单记录表.xlsx";
              if ("download" in document.createElement("a")) {
                // 非IE下载
                const elink = document.createElement("a");
                elink.download = fileName;
                elink.style.display = "none";
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
              } else {
                // IE10+下载
                navigator.msSaveBlob(blob, fileName);
              }
              loading.close();
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    noRefund(row) {
      this.$prompt("请输入拒绝退款原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputPattern: /\S/,
        inputErrorMessage: "原因不能为空",
      })
        .then(({ value }) => {
          let data = {
            orderId: row.id,
            remark: value,
          };

          cancelRefund(data)
            .then((res) => {
              console.log(res);
              this.orderDialogVisible = false;
              this.getList();
            })
            .catch((error) => {
              Message({
                message: error.errmsg,
                type: "error",
              });
            });
        })
        .catch(() => {});
    },
    jie() {
      queryTrack({ orderId: id }).then((response) => {
        console.log(response, "response");
        this.base64 = [];
        this.jieDialogVisible = true;
        if (response.data.tracks.length > 0) {
          this.activities = response.data.tracks;
        }
      });
    },
    getBase64Images(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataURL = canvas.toDataURL("image/png"); // 可选其他值 image/jpeg
      return dataURL;
    },
    base64s(id) {
      for (let index = 0; index < this.base64.length; index++) {
        const element = this.base64[index];
        if (id == element.id) {
          return element.img;
        }
      }
    },
    plccun() {
      html2canvas(document.querySelector("#capture"), { scale: 2 }).then(
        (canvas) => {
          const imgUrl = canvas.toDataURL("png", 2.0); // 获取生成的图片的url
          var alink = document.createElement("a");
          alink.href = imgUrl;
          alink.download = this.orderDetail.orderRespDto.orderSn; //图片名
          alink.click();
        }
      );
    },
    getmumber(order, type) {
      let priceall = 0;
      let incomeTaxall = 0;
      for (let index = 0; index < order.length; index++) {
        const element = order[index];
        priceall += Number(element.priceall);
        incomeTaxall += Number(element.incomeTaxall);
      }
      if (type == "priceall") {
        return priceall;
      }
      if (type == "incomeTaxall") {
        return incomeTaxall;
      }
    },
    main(src, id) {
      if (this.base64.length < this.orderDetail.orderGoodsRespDtoList.length) {
        var image = new Image();
        image.src = src + "?v=" + Math.random(); // 处理缓存
        image.crossOrigin = "*"; // 支持跨域图片
        let thit = this;

        image.onload = function () {
          let data = {
            img: thit.getBase64Images(image),
            id: id,
          };
          thit.base64.push(data);
        };
        console.log(thit.base64);
      }
    },
    onRefund(row) {
      let data = {
        orderId: row.id,
      };
      orderrefund(data)
        .then((res) => {
          console.log(res);
          this.orderDialogVisible = false;
          this.getList();
        })
        .catch((error) => {
          Message({
            message: error.errmsg,
            type: "error",
          });
        });
    },
    openimage(row) {
      console.log(row);
      this.imagedialogVisible = true;
      this.imageopenurl = row.shoppingReceipts;
    },
    upimg(row) {
      console.log(row);
      this.upimagefrom.orderId = row.id;
      this.upimagefrom.shoppingReceipts = "";
      this.upimagedialogVisible = true;
    },
    uolodeimg(from) {
      console.log(this.upimagefrom);
      this.$refs[from].validate((valid) => {
        if (valid) {
          updateShoppingReceipts(this.upimagefrom)
            .then(() => {
              this.upimagedialogVisible = false;
              this.$notify({
                title: "成功",
                message: "上传成功",
                type: "success",
                duration: 2000,
              });
              this.getList();
            })
            .catch((error) => {
              this.$message({
                message: error.errmsg,
                type: "error",
              });
            });
        }
      });
    },
    cancelMode() {
      this.shipDialogVisible = false;
      this.$refs["shipForm"].resetFields();
      console.info(this.shipForm);
    },
    deliverGoodsHandle(rowdata) {
      this.shipForm.orderId = rowdata.id;
      this.shipForm.shipChannel = rowdata.shipChannel;
      this.shipForm.shipSn = rowdata.shipSn;
      this.shipForm.shoppingReceipts = "";
      this.shipDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["shipForm"].clearValidate();
      });
    },
    confirmShip() {
      console.log(this.shipForm);
      this.$refs["shipForm"].validate((valid) => {
        if (valid) {
          shipOrder(this.shipForm)
            .then(() => {
              this.shipDialogVisible = false;
              this.$notify({
                title: "成功",
                message: "确认发货成功",
                type: "success",
                duration: 2000,
              });
              this.getList();
            })
            .catch((error) => {
              this.$message({
                message: error.errmsg,
                type: "error",
              });
            });
        }
      });
    },
    updatepic(row) {
      this.$prompt("请输入小票金额", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.purchasePrice,
        inputType: "number",
        inputPattern: /\S/,
        inputErrorMessage: "小票金额不能为空",
      })
        .then(({ value }) => {
          let data = {
            orderGoodsId: row.id,
            purchasePrice: value,
          };

          updateOrderGoodsPurchasePrice(data)
            .then((res) => {
              console.log(res);
              row.purchasePrice = value;
              this.$message({
                type: "success",
                message: "更新成功",
              });
              this.getList();
            })
            .catch((error) => {
              this.$message({
                message: error.errmsg,
                type: "error",
              });
            });
        })
        .catch(() => {});
    },
    changeImgs(val, type) {
      this.pickImportForm[type] = val;
    },
    pickListImport(type, item) {
      this.pickImportForm.orderNumber = item.orderSn;
      this.pickImportForm.list = item.orderGoodsDtos;
      this.pickImportForm.shoppingReceipts = "";
      this.pickImportDialogVisible = true;
      this.alltitle = type;
      // this.$nextTick(() => {
      //   this.$refs["pickImportForm"].clearValidate();
      // });
      this.$nextTick(() => {
        this.$refs.gain.focus();
      }, 100);
    },
    confirmPickImport(formName) {
      console.log(this.pickImportForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.alltitle == "拣货入库") {
            let list = [];
            for (
              let index = 0;
              index < this.pickImportForm.list.length;
              index++
            ) {
              const element = this.pickImportForm.list[index];
              // if (element.purchasePrice) {
              let data = {
                orderGoodsId: element.id,
                purchasePrice: element.purchasePrice
                  ? element.purchasePrice
                  : 0,
              };
              list.push(data);
              // } else {
              //   this.$alert(element.goodsName + "价格不能为空", "提示", {
              //     confirmButtonText: "确定",
              //     type: "error",
              //   });
              //   return;
              // }
            }
            pickUpImport({
              list: list,
              orderSn: this.pickImportForm.orderNumber,
              shoppingReceipts: this.pickImportForm.shoppingReceipts
                ? this.pickImportForm.shoppingReceipts
                : -1,
            })
              .then((res) => {
                console.log(res);
                let data = res;
                if (data.code == "200") {
                  this.$message({
                    message: "拣货入库成功！",
                    type: "success",
                  });
                  this.getList();
                  this.pickImportDialogVisible = false;
                  this.$refs["pickImportForm"].resetFields();
                }
              })
              .catch((error) => {
                this.$message({
                  message: error.errmsg,
                  type: "error",
                });
              });
          } else {
            splitOrder({
              orderSn: this.pickImportForm.orderNumber,
            })
              .then((res) => {
                let data = res;
                if (data.errno == "0") {
                  Message({
                    message: "手动拆单成功！",
                    type: "success",
                  });
                  this.getList();
                  this.pickImportDialogVisible = false;
                  this.$refs["pickImportForm"].resetFields();
                }
              })
              .catch((error) => {
                this.$message({
                  message: error.errmsg,
                  type: "error",
                });
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelPickImport() {
      this.pickImportDialogVisible = false;
      this.$refs["pickImportForm"].resetFields();
    },
    detailsHandle(id) {
      this.$nextTick(function () {
        detailOrder({ orderId: id }).then((response) => {
          console.info(response.data.order);
          this.orderDetail = response.data;

          this.orderDetail.refundInfoDtos = [];
          this.orderDetail.refundInfoDtos.push(this.orderDetail.refundInfoDto);
          console.log(this.orderDetail.refundInfoDtos, 555555);
          this.orderDialogVisible = true;
          for (
            let index = 0;
            index < this.orderDetail.orderGoodsRespDtoList.length;
            index++
          ) {
            const element = this.orderDetail.orderGoodsRespDtoList[index];
            element.incomeTaxall = (element.incomeTax * element.number).toFixed(
              2
            );
            element.priceall = (element.price * element.number).toFixed(2);
          }
          this.orderDetail.Waybill = new Array(response.data.orderRespDto);

          //运输方式
          var obj = this.orderDetail.Waybill[0].transportation;
          for (var item in transportationType) {
            if (transportationType[item].value == obj) {
              this.orderDetail.Waybill[0].transportation =
                obj + "-" + transportationType[item].label;
            }
          }
          //包装类型
          var lab = this.orderDetail.Waybill[0].packingType;
          for (var val in packingType) {
            if (packingType[val].value == lab) {
              this.orderDetail.Waybill[0].packingType =
                lab + "-" + packingType[val].label;
            }
          }

          //国家代码
          var coun = this.orderDetail.Waybill[0].shipperCountry;
          for (var opt in contry) {
            if (contry[opt].code == coun) {
              this.orderDetail.Waybill[0].shipperCountry =
                coun + "-" + contry[opt].name;
            }
          }
        });
      });
    },
    enterBarcodesHandle(rowdata) {
      this.enterBarcodesDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["enterBarcodesForm"].clearValidate();
      });
      this.enterBarcodesForm.orderNum = rowdata.orderSn;
      this.enterBarcodesForm.orderId = rowdata.id;

      this.$nextTick(() => {
        this.$refs.cartonBoxInput.focus();
      }, 100);
    },
    getSummaries(param) {
      console.log(param);
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (index !== 1 && index !== 2) {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                if (index == 5) {
                  return Number(prev) + Number(curr);
                } else {
                  return (Number(prev) + Number(curr)).toFixed(2);
                }
              } else {
                return prev;
              }
            }, 0);
            sums[index] += "";
          }
        }
      });

      return sums;
    },
    boxCodeChange() {
      if (this.enterBarcodesForm.cartonBoxBarCode.length > 10) {
        this.enterBarcodesForm.cartonBoxBarCode = "";
      }
    },
    cancelEnterBarcodes() {
      this.enterBarcodesDialogVisible = false;
      this.$refs["enterBarcodesForm"].resetFields();
    },
    confirmEnterBarcodes() {
      this.$refs["enterBarcodesForm"].validate((valid) => {
        if (valid) {
          makePackBarCode({
            orderId: this.enterBarcodesForm.orderId,
            freeTaxBarCode: this.enterBarcodesForm.freeTaxBarCode
              .trim()
              .split(/\s+/),
            cartonBoxBarCode: this.enterBarcodesForm.cartonBoxBarCode,
          })
            .then((res) => {
              let data = res;
              if (data.code == 200) {
                this.$message({
                  message: "免税袋纸箱条码录入成功！",
                  type: "success",
                });
                this.getList();
                this.enterBarcodesDialogVisible = false;
                this.$refs["enterBarcodesForm"].resetFields();
              }
            })
            .catch((error) => {
              this.$message({
                message: error.errmsg,
                type: "error",
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getList() {
      console.log(this.formInline.deta);
      let beginTime = "";
      let endTime = "";
      if (this.formInline.deta.length > 0) {
        beginTime = this.dateFormats(this.formInline.deta[0]);
        endTime = this.dateFormats(this.formInline.deta[1]);
      }
      const param = {
        orderStatusArray: this.formInline.orderStatusArray,
        keys: this.formInline.keys,
        allocateCargoStatus: this.formInline.allocateCargoStatus,
        beginTime: beginTime,
        endTime: endTime,
        page: this.pageNum,
        size: this.pageSize,
      };
      orderlist(param).then((response) => {
        console.log(response, "response");
        this.tableData = response.data.list;
        this.total = response.data.total;
      });
    },
    onSubmit() {
      this.getList();
    },
    dateFormats(date) {
      console.log(date);
      return dateFormat("YYYY-mm-dd HH:MM:SS", date);
    },
    handleDelete(row) {
      this.$confirm("确认删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Delete({ id: row.id }).then((response) => {
            console.log(response, "response");
            this.getList();
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    audit(row) {
      this.dltitle = "审核评论";
      this.dialogVisible = true;
      this.form.goodsName = row.goodsName;
      this.form.picUrls = row.picUrls;
      this.form.content = row.content;
      this.form.id = row.id;
      this.form.content = row.content;
      console.log(row, "row");
    },
    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // if(this.form.status == '1'){
          // this.form.status ==  '通过'
          // }else{
          //   this.form.status == '不通过'
          // }
          // this.form.customsChannelsIds = JSON.stringify(
          //   this.form.customsChannelsIds
          // )
          // this.form.status = JSON.parse(this.form.status)
          this.form.status = this.form.status.toString();
          getExamine({
            id: this.form.id,
            status: this.form.status,
          })
            .then((response) => {
              // debugger
              console.log(response, "6666666666688888");
              this.dialogVisible = false;
              this.getList();
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeStatus(val, index) {
      console.log(index, "index");
      console.log(val, "val");
    },
    ifendcase(val) {
      if (val.status == "0") {
        return "待审核";
      } else if (val.status == "1") {
        return "审核通过";
      } else {
        return "审批未通过";
      }
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getList();
    },
  },
};
</script>

<style lang='scss' >
.text {
  font-size: 14px;
}
.order-detail-goods {
  p {
    padding: 0;
    margin: 0;
  }
  .item {
    background: #fff;
    padding: 0 14px;
    box-sizing: border-box;
  }

  .row {
    padding: 10px 0;
    .r {
      float: right;
      color: #f23030;
    }
  }

  .product-box {
    padding: 10px 0;
    display: flex;
    img {
      width: 100px;
      height: 100px;
      padding: 5px;
      background: #f6f6f6;
      //   box-sizing: border-box;
    }

    .left {
      margin-left: 10px;
      p {
        color: #000;
      }
    }
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  box-sizing: border-box;
  // width: 480px;
  .clearfix {
    .input_search {
      width: 380px;
    }
  }
}
.orderDetailBody {
  .el-dialog__body {
    padding-top: 10px;
  }
}

.user-name-box {
  padding-right: 10px;
}

.order-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 0;
  font-weight: bold;
}

.order-title-box {
  background: #f5f7fa;
  display: flex;
  flex-direction: row;
  border: 1px solid #ebeef5;
  border-bottom: 0;
  justify-content: space-between;
  .order-title-item {
    padding: 5px;
  }
}

.order-title-bottom {
  display: flex;
  flex-direction: row;
  border: 1px solid #ebeef5;
  justify-content: space-between;
  border-top: 0;
  .order-title-item {
    padding: 5px;
  }
}

.section-box {
  border: 1px solid #ebeef5;
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  .title-box-left {
    background: #f5f7fa;
    font-size: 14px;
    color: #606266;
    margin: 0;
    padding: 10px 5px;
    flex: 0 0 80px;
    border-right: 1px solid #ebeef5;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  .content-box {
    padding: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    .line-box {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .item-box {
      // flex: 1;
      flex: 0 1 500px;
      &.user-name {
        flex: 0 0 200px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    p {
      padding: 0;
      margin: 0;
      margin-bottom: 5px;
    }
  }
  .price-table {
    th,
    td {
      text-align: left;
    }
  }
}
.tables td {
  border: 1px solid #ccc;
}
// .tables  p>span{
//   width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
//   text-align: left;
//   display: inline-block;
// }
.red-text {
  color: #e64340;
}

.time-pick-box {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
}
.item {
  margin-bottom: 10px;
}
.command-but {
  padding: 7px 10px;
}
.order-detail-status {
  //   height: 100px;
  b {
    //  color: #000;
    font-size: 18px;
  }
  background-color: #ffdf00;
  background-image: url("../../assets/order.png");
  background-size: 80px;
  background-position: right center;
  background-repeat: no-repeat;
  color: #de1d00;
  padding: 30px;
  box-sizing: border-box;
}
.order-detail-info {
  background: #fff;
  padding: 20px 14px;
  p {
    padding: 5px 0;
    margin: 0;
  }
  .red {
    color: red;
  }
}
.btns {
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 10px;
  text-align: right;
  box-sizing: border-box;
  border-top: 1px solid #eee;
}
.order-address-bar {
  background: #fff;
  .order-address-box {
    padding: 12px 0 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .content-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      .user-box {
        font-size: 16px;
        // font-weight: 600;
        margin: 0;
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: #222;
      }
      .address-box {
        padding-top: 8px;
        margin: 0;
        .tip {
          display: inline-block;
          background: #f23030;
          font-size: 10px !important;
          color: #fff;
          border-radius: 8px;
          box-sizing: border-box;
          padding: 0px 10px;
          font-size: 12px;
          display: inline-block;
          transform: translateY(-2px);
          vertical-align: middle;
        }
      }
    }
    .icon-box {
      flex: 0 0 20px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      text-align: right;
      svg {
        transform: translateX(8px);
        font-weight: bold;
      }
      &:first-child {
        justify-content: start;
      }
      &:last-child {
        justify-content: end;
      }
    }
  }
}
.van-nav-bar .van-icon {
  color: #797979;
}
.van-nav-bar__text {
  color: #797979;
}
.celsl .cell {
  padding: 0 !important;
}
.goodsbottom {
  border-bottom: 1px solid #ccc;
}
</style>
