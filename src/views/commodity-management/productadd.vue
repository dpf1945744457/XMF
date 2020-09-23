<template>
  <div style="background:#fff;padding: 18px">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="商品简称" prop="goodsShortName">
        <el-input v-model="ruleForm.goodsShortName"></el-input>
      </el-form-item>
      <el-form-item label="英文名称" prop="goodsEnglishName">
        <el-input v-model="ruleForm.goodsEnglishName"></el-input>
      </el-form-item>
      <el-form-item label="商品主图" prop="picUrl">
        <!-- <imgVideoUpload :typeInfo="1" @change="changeGallery"></imgVideoUpload> -->
        <avatarUpload :url="ruleForm.picUrl" @change="changeImgs($event,'picUrl')"></avatarUpload>
        <!-- <span>注：第一张为默认主图，最多上传10张</span> -->
      </el-form-item>
      <el-form-item label="宣传画廊" prop="gallerys">
        <imgVideoUpload :typeInfo="1" @change="changeGallery"></imgVideoUpload>
        <span>注：最多上传10张</span>
      </el-form-item>
      <el-form-item label="所属分类" prop="classifyId">
        <el-select v-model="ruleForm.classifyId" placeholder="请选择分类">
          <el-option
            v-for="item in classifyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            :disabled="!item.enabled"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否推荐">
        <el-radio-group v-model="ruleForm.isTop">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="税号类型">
        <el-radio-group v-model="ruleForm.taxType">
          <el-radio :label="1">bc</el-radio>
          <el-radio :label="2">cc</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="BC行邮税号" prop="ncadCode">
        <!--<el-input v-model="goods.ncadCode"></el-input>-->
        <el-select filterable v-model="ruleForm.ncadCode" @change="incomeTaxchange">
          <el-option
            v-for="item in taxRateList"
            :key="item.taxHsCode"
            :label="item.taxHsName"
            :value="item.taxHsCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="CC行邮税号" prop="ccCode">
        <el-select filterable v-model="ruleForm.ccCode" @change="danweis">
          <template v-for="item in CCtaxRateList">
            <el-option
              :key="item.taxCcCode"
              v-if="item.ccTax>0"
              :label="item.taxHsName+'('+item.ccTax*100+'%'+')'"
              :value="item.taxCcCode"
            ></el-option>
          </template>
        </el-select>
      </el-form-item>

      <el-form-item label="商品产地" prop="country">
        <el-select v-model="ruleForm.country" filterable placeholder="请选择产地">
          <el-option
            v-for="item in countryList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品单位" prop="unit">
        <el-select filterable v-model="ruleForm.unit" placeholder="请选择商品单位">
          <el-option
            v-for="item in unitList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属展馆">
        <el-cascader
          expand-trigger="hover"
          :options="categoryList"
          :props="{value:'id',label:'name'}"
          @change="handleCategoryChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="所属品牌商" prop="brandId">
        <el-select v-model="ruleForm.brandId" filterable placeholder="请选择所属品牌商">
          <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供货商" prop="supplierId">
        <el-select v-model="ruleForm.supplierId" filterable placeholder="请选择供货商">
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :label="item.merName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货区域" prop="shipmentRegion">
        <el-select v-model="ruleForm.shipmentRegion" placeholder="请选择发货区域">
          <el-option label="国内" value="0"></el-option>
          <el-option label="国外" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品简介" prop="brief">
        <el-input v-model="ruleForm.brief"></el-input>
      </el-form-item>
      <el-form-item label="商品详细介绍" prop="detail">
        <Tinymce v-model="ruleForm.detail"></Tinymce>
      </el-form-item>
      <el-divider></el-divider>
      <div style="padding-left: 30px;">
        <p style="font-size: 20px;">规格设置</p>
        <el-button type="primary" size="small" @click="addguize">新增一组规格</el-button>
        <p>
          <el-card
            class="box-card"
            style="width:300px;display: inline-block;margin: 10px;"
            :body-style="{height:'200px',padding:'10px',overflow:'auto'}"
            v-for="(rull,index) in rulllist"
            :key="index"
          >
            <div slot="header" class="clearfix">
              <span>{{rull.name}}</span>
              <el-button
                style="float: right; padding: 3px 0"
                @click="end(rull,index)"
                type="text"
              >编辑</el-button>
              <el-button
                style="float: right; padding: 3px 0;color:red"
                @click="remrull(rull,index)"
                type="text"
                v-if="index!=0"
              >删除</el-button>
            </div>
            <table
              border="1"
              style="width:100%;text-align: center;"
              cellpadding="0"
              cellspacing="0"
            >
              <tr :label="'选项'+(index+1)" v-for="(item,index) in rull.guize" :key="index">
                <td width="50%" style="height: 40px;">选项{{(index+1)}}</td>

                <td style="height: 40px;">{{item.value}}</td>
              </tr>
            </table>
          </el-card>
        </p>
        <el-button type="primary" size="small" @click="subal" v-if="rulllist.length>0">完成</el-button>
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{background:'#e3d5d5',color:'#000',textAlign:'center'}"
        >
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column prop="specifications" align="center" label="规格选项">
            <template slot-scope="scope">
              <p
                v-for="(name,index) in scope.row.name"
                :key="index"
              >{{name}}:{{scope.row.specifications[index]}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="counterPrice" align="center" label="专柜价格">
            <template slot-scope="scope">
              <el-input v-model="scope.row.counterPrice" min='0' type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="price" align="center" label="当前价格">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price" min='0' type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="customsUnitNum" align="center" label="清关规格" width="150px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.customsUnitNum" min='0' type="number" style="width:150px">
                <template slot="append">{{danwei}}</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="url" align="center" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.url" width="40" v-if="scope.row.url" />
            </template>
          </el-table-column>
          <el-table-column prop="postage" align="center" label="邮费">
            <template slot-scope="scope">
              <el-input v-model="scope.row.postage" min='0' type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="freeShipping" align="center" label="是否包邮">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.freeShipping"
                active-color="#13ce66"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="taxFlag" align="center" label="是否包税">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.taxFlag"
                active-color="#13ce66"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="库存" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.number" min='0' type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="ende(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-divider></el-divider>
      <div style="padding-left: 30px;">
        <p style="font-size: 20px;">商品参数</p>
        <el-button type="primary" size="small" @click="addcanshu">新增参数</el-button>
        <el-table
          :data="canshutableData"
          style="width: 100%"
          :header-cell-style="{background:'#e3d5d5',color:'#000',textAlign:'center'}"
        >
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column align="center" prop="attribute" label="参数名称"></el-table-column>
          <el-table-column align="center" prop="value" label="参数值"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="canshurm(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-divider></el-divider>

      <div style="padding-left: 30px;">
        <p style="font-size: 20px;">报备参数</p>
        <el-form-item label="法定第一单位" prop="firstUnit">
          <el-select filterable v-model="ruleForm.firstUnit">
            <el-option
              v-for="item in unitList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第一单位数量" prop="firstNum">
          <el-input v-model="ruleForm.firstNum"></el-input>
        </el-form-item>
        <el-form-item label="检验检疫备案编号" prop="quarantineNo">
          <el-input v-model="ruleForm.quarantineNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="海关分类编号" prop="customsClassificationNo">
          <el-input v-model="ruleForm.customsClassificationNo" disabled placeholder="即HS编码"></el-input>
        </el-form-item>

        <el-divider></el-divider>
        <el-form-item label="法定第二单位" prop="secUnit">
          <el-select filterable v-model="ruleForm.secUnit">
            <el-option
              v-for="item in unitList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第二单位数量" prop="secNum">
          <el-input v-model="ruleForm.secNum"></el-input>
        </el-form-item>
        <el-form-item label="海关正式备案编号" prop="customsRecordNo">
          <el-input v-model="ruleForm.customsRecordNo" disabled placeholder="填HS编码"></el-input>
        </el-form-item>

        <el-form-item label="报备毛重" prop="grossWeight">
          <el-input v-model="ruleForm.grossWeight">
            <template slot="append">kg</template>
          </el-input>
        </el-form-item>
        <el-form-item label="报备净重" prop="netWeight">
          <el-input v-model="ruleForm.netWeight">
            <template slot="append">kg</template>
          </el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">创建商品</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="新增参数" :visible.sync="canshudialogFormVisible">
      <el-form :model="canshuform" label-width="100px" ref="canshuform">
        <el-form-item
          label="参数名称"
          prop="attribute"
          :rules="[
      { required: true, message: '请输入参数名称', trigger: 'blur' },
      { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
     
    ]"
        >
          <el-input v-model="canshuform.attribute" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="参数详细"
          prop="value"
          :rules="[
      { required: true, message: '请输入参数详细', trigger: 'blur' },
       { min: 1, max: 70, message: '长度在 1 到 70 个字符', trigger: 'blur' }
     
    ]"
        >
          <el-input v-model="canshuform.value" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canshudialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="canshuadd('canshuform')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="rulltitle" :visible.sync="dialogFormVisible" width="450px">
      <el-form :model="gzform" label-width="100px" ref="gzform">
        <el-form-item
          label="规格名称："
          prop="name"
          :rules="[
      { required: true, message: '请输入规格名称', trigger: 'blur' }
     
    ]"
        >
          <el-input v-model="gzform.name" autocomplete="off" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(guize, index) in gzform.guize"
          :label="'选项' + (index+1)"
          :key="guize.key"
          :prop="'guize.' + index + '.value'"
          :rules="{
      required: true, message: '选项'+(index+1)+'不能为空', trigger: 'blur'
    }"
        >
          <el-input v-model="guize.value" style="width:200px"></el-input>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click.prevent="removeDomain(guize)"
            v-if="index!=0"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            @click.prevent="addDomain"
            v-if="index+1==gzform.guize.length"
          ></el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="rulltitle=='新增规格'" @click="addrul('gzform')">确 定</el-button>
        <el-button type="primary" v-if="rulltitle=='编辑规格'" @click="endrul()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 规格设置 -->

    <el-dialog title="修改规格" :visible.sync="productVisiable" width="960px">
      <el-form
        ref="productForm"
        :rules="rulest"
        :model="productForm"
        status-icon
        label-position="right"
        label-width="110px"
      >
        <el-form-item label="规格选项" prop="specifications">{{productForm.specifications1}}</el-form-item>
        <!--<el-form-item prop="goodsSn" label="商品货号">-->
        <!--<el-input v-model="productForm.goodsSn"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="专柜价格" prop="counterPrice">
          <el-input v-model="productForm.counterPrice" min='0' type="number"></el-input>
        </el-form-item>
        <el-form-item label="当前价格" prop="price">
          <el-input v-model="productForm.price" min='0' type="number"></el-input>
        </el-form-item>

        <el-form-item prop="customsUnitNum" label="清关规格">
          <el-input v-model="productForm.customsUnitNum" min='0' type="number">
            <template slot="append">{{danwei}}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="供货价" prop="supplyPrice">
          <el-input v-model="productForm.supplyPrice" min='0' type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品条码">
          <el-input v-model="productForm.barCode"></el-input>
        </el-form-item>
        <el-form-item prop="netWeight" label="商品净重">
          <el-input v-model="productForm.netWeight" min='0' type="number">
            <template slot="append">kg</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="grossWeight" label="商品毛重">
          <el-input v-model="productForm.grossWeight" min='0' type="number">
            <template slot="append">kg</template>
          </el-input>
        </el-form-item>
        <el-form-item label="邮费" prop="postage">
          <el-input v-model="productForm.postage" min='0' type="number"></el-input>
        </el-form-item>
        <el-form-item label="是否包邮" prop="freeShipping">
          <el-switch
            v-model="productForm.freeShipping"
            active-color="#13ce66"
            inactive-color
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        <el-form-item label="库存数量" prop="number">
          <el-input v-model="productForm.number" type="number"></el-input>
        </el-form-item>
        <!-- <el-form-item label="缺货说明" prop="remark" v-if="productForm.number==0">
          <el-input v-model="productForm.remark"></el-input>
        </el-form-item>-->
        <el-form-item label="商品图片" prop="url">
          <avatarUpload :url="productForm.url" @change="changeImg($event,'url')"></avatarUpload>
        </el-form-item>
        <el-form-item label="是否包税" prop="taxFlag">
          <el-switch
            v-model="productForm.taxFlag"
            active-color="#13ce66"
            inactive-color
            active-text="是"
            inactive-text="否"
          ></el-switch>
          <!-- <span v-if="productForm.taxFlag==0">税费：{{productForm.incomeTax}}</span> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiao">取消</el-button>
        <el-button type="primary" @click="handleProductEdit('productForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import avatarUpload from "@/components/Upload/avatarUpload";
import imgVideoUpload from "@/components/Upload/imgVideoUpload";
import {
  ccall,
  bcall,
  categorytree,
  brandall,
  classifyall,
  merchantall,
  goodsadd,
  countryall,
} from "@/api/addprouct";

import unitList from "@/data/unit.json";
import Tinymce from "@/components/Tinymce";
export default {
  name: "",
  data() {
    return {
      rulltitle: "新增规格",
      tableData: [],
      canshuform: { attribute: "", value: "" },
      canshutableData: [],
      categoryList: [],
      brandList: [],
      classifyList: [],
      supplierList: [],
      gzform: {
        guize: [
          {
            value: "",
          },
        ],
        name: "",
      },
      rulllist: [],
      unitList: unitList,
      danwei: "件",
      dialogFormVisible: false,
      productVisiable: false,
      canshudialogFormVisible: false,
      productForm: {
        barCode: "",
        counterPrice: "",
        customsUnitNum: "",
        freeShipping: "",
        customsUnit: "",
        grossWeight: "",
        netWeight: "",
        number: "0",
        postage: "",
        price: "",
        incomeTax: 0.0,
        supplyPrice: "",
        specifications: "",
        specifications1: "",
        name: "",
        taxFlag: false,
        url: "",
      },
      CCtaxRateList: [],
      taxRateList: [],
      countryList: [],
      ruleForm: {
        name: "",
        goodsEnglishName: "",
        gallery: "",
        classifyId: "",
        isTop: false,
         taxType:1,
      },
      rulest: {
        barCode: [
          { required: true, message: "商品条码不能为空", trigger: "blur" },
        ],
        taxHsCode: [
          { required: true, message: "请选择商品类目", trigger: "change" },
        ],
        postage: [{ required: true, message: "邮费不能为空", trigger: "blur" }],
        number: [
          { required: true, message: "库存数量不能为空", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "缺货说明不能为空", trigger: "change" },
        ],
        customsUnitNum: [
          { required: true, message: "清关规格不能为空", trigger: "change" },
        ],
      },
      rules: {
        goodsSn: [
          { required: true, message: "商品编号不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        goodsShortName: [
          { required: true, message: "商品简称不能为空", trigger: "blur" },
        ],
        goodsEnglishName: [
          { required: true, message: "英文名称不能为空", trigger: "blur" },
        ],
        detail: [
          { required: true, message: "商品详情不能为空", trigger: "blur" },
        ],
        picUrl: [
          { required: true, message: "请上传商品主图", trigger: "blur" },
        ],
        gallerys: [
          { required: true, message: "请上传商品画廊", trigger: "blur" },
        ],
        retailPrice: [
          { required: true, message: "当前价格不能为空", trigger: "blur" },
        ],
        country: [
          { required: true, message: "请选择商品原产地", trigger: "blur" },
        ],
        firstUnit: [
          { required: true, message: "法定第一单位不能为空", trigger: "blur" },
        ],
        firstNum: [
          { required: true, message: "第一单位数量不能为空", trigger: "blur" },
        ],
        customsClassificationNo: [
          { required: true, message: "海关分类编号不能为空", trigger: "blur" },
        ],
        netWeight: [
          { required: true, message: "报备净重不能为空", trigger: "blur" },
        ],
        customsRecordNo: [
          {
            required: true,
            message: "海关正式备案编号不能为空",
            trigger: "blur",
          },
        ],
        ncadCode: [
          { required: true, message: "BC行邮税号不能为空", trigger: "blur" },
        ],

        ccCode: [
          { required: true, message: "CC行邮税号不能为空", trigger: "blur" },
        ],
        grossWeight: [
          { required: true, message: "报备毛重不能为空", trigger: "blur" },
        ],
        unit: [
          { required: true, message: "商品单位不能为空", trigger: "blur" },
        ],
        classifyId: [
          { required: true, message: "商品类型不能为空", trigger: "blur" },
        ],
        brandId: [
          { required: true, message: "所属品牌商不能为空", trigger: "blur" },
        ],
        supplierId: [
          { required: true, message: "供货商不能为空", trigger: "blur" },
        ],
        shipmentRegion: [
          { required: true, message: "发货区域不能为空", trigger: "blur" },
        ],
      },
    };
  },
  components: { avatarUpload, imgVideoUpload, Tinymce },
  created() {},
  mounted() {
    this.getccall();
    this.getbcall();
    this.init();
  },
  methods: {
    init() {
      categorytree().then((response) => {
        this.categoryList = response.data;
      });

      brandall().then((response) => {
        this.brandList = response.data;
      });
      classifyall().then((response) => {
        this.classifyList = response.data;
      });
      merchantall().then((response) => {
        this.supplierList = response.data;
      });
      countryall().then((response) => {
        this.countryList = response.data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.rulllist.length == 0) {
            this.$alert("请配置商品规格", "标题名称", {
              confirmButtonText: "确定",
              type: "error",
            });
            return;
          }
          // for (let index = 0; index < this.tableData.length; index++) {
          //   const element = this.tableData[index];
          //   element.customsUnit = this.danwei;
          //   for (let key in element) {
          //     if (
          //       element[key] == "" &&
          //       key != "freeShipping" &&
          //       key != "taxFlag"
          //     ) {
          //       debugger;
          //       this.$alert("请配置完整商品规格参数", "标题名称", {
          //         confirmButtonText: "确定",
          //         type: "error",
          //       });
          //       return;
          //     }
          //   }
          // }
          let gallery = [];
          for (let index = 0; index < this.ruleForm.gallerys.length; index++) {
            const element = this.ruleForm.gallerys[index];
            gallery.push(element.image);
          }

          let goodsSpecifications = [];
          for (let index = 0; index < this.rulllist.length; index++) {
            const element = this.rulllist[index];
            for (let i = 0; i < element.guize.length; i++) {
              const guize = element.guize[i];
              let list = {
                specification: element.name,
                value: guize.value,
              };
              goodsSpecifications.push(list);
            }
          }

          this.ruleForm.goodsProducts = this.tableData;
          this.ruleForm.goodsSpecifications = goodsSpecifications;
          this.ruleForm.gallery = gallery;
          this.ruleForm.goodsAttributes = this.canshutableData;
          console.log(this.ruleForm);

          goodsadd(this.ruleForm).then((response) => {
            console.log(response);
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });

            this.$router.push({
              name: "productList",
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCategoryChange(value) {
      this.ruleForm.categoryId = value[value.length - 1];
    },
    incomeTaxchange(val) {
      console.log(val);
      this.ruleForm.customsRecordNo = val;
      this.ruleForm.customsClassificationNo = val;
    },
    remrull(rull, index) {
      this.$confirm("删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.rulllist.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getccall() {
      ccall().then((response) => {
        console.log(response);
        this.CCtaxRateList = response.data;
      });
    },
    getbcall() {
      bcall().then((response) => {
        this.taxRateList = response.data;
        console.log(response);
      });
    },
    danweis(type) {
      console.log(type);
      for (let index = 0; index < this.CCtaxRateList.length; index++) {
        const element = this.CCtaxRateList[index];
        if (type == element.taxCcCode) {
          // console.log(element.specification);
          this.danwei = element.specification;
        }
      }
    },
    quxiao() {
      this.productVisiable = false;
    },
    canshurm(row) {
      const index = this.canshutableData.indexOf(row);
      this.canshutableData.splice(index, 1);
    },

    addcanshu() {
      (this.canshuform = { attribute: "", value: "" }),
        (this.canshudialogFormVisible = true);
    },
    canshuadd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var targetObj = JSON.stringify(this.canshuform);
          let arr4 = JSON.parse(targetObj);
          this.canshutableData.push(arr4);
          this.canshudialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeGallery(fileList, flag) {
      if (flag) {
        this.ruleForm.gallerys = fileList;
      } else {
        // this.txtMedia.push('');
        for (let i in fileList) {
          fileList[i].txtMedia =
            fileList[i].txtMedia && fileList[i].txtMedia.length > 0
              ? fileList[i].txtMedia
              : "";
          fileList[i].txtMedia = "";
        }
        this.ruleForm.gallerys = fileList;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    changeImg(val, type) {
      this.productForm[type] = val;
    },
    changeImgs(val, type) {
      this.ruleForm[type] = val;
    },

    addDomain() {
      this.gzform.guize.push({
        value: "",
        key: Date.now(),
      });
    },
    addrul(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var targetObj = JSON.stringify(this.gzform);
          let arr4 = JSON.parse(targetObj);
          this.rulllist.push(arr4);
          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addguize() {
      this.rulltitle = "新增规格";
      (this.gzform = {
        guize: [
          {
            value: "",
          },
        ],
        name: "",
      }),
        (this.dialogFormVisible = true);
    },
    removeDomain(item) {
      var index = this.gzform.guize.indexOf(item);
      if (index !== -1) {
        this.gzform.guize.splice(index, 1);
      }
    },
    end(row, index) {
      this.rulltitle = "编辑规格";
      var arr = JSON.parse(JSON.stringify(row));
      let arr4 = JSON.parse(JSON.stringify(arr));
      arr4.index = index;
      this.gzform = arr4;
      this.dialogFormVisible = true;
    },
    endrul() {
      this.rulllist[this.gzform.index].guize = this.gzform.guize;
      this.rulllist[this.gzform.index].name = this.gzform.name;
      this.dialogFormVisible = false;
    },
    ende(row) {
      this.productForm = row;
      this.productVisiable = true;
    },
    handleProductEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.productVisiable = false;
        }
      });
    },
    subal() {
      this.$confirm("此操作将重新组合下列数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let lits = [];
          this.tableData = [];
          let namelist = [];
          for (let index = 0; index < this.rulllist.length; index++) {
            const element = this.rulllist[index];
            namelist.push(element.name);
            let sidlist = [];
            for (let index = 0; index < element.guize.length; index++) {
              const element1 = element.guize[index];
              sidlist.push(element1.value);
            }
            lits.push(sidlist);
          }
          console.log(lits);
          var ret = this.doExchange(lits);
          for (let index = 0; index < ret.length; index++) {
            const element = ret[index];
            let data = {
              barCode: "",
              counterPrice: "",
              customsUnitNum: "",
              customsUnit: "",
              freeShipping: false,
              grossWeight: "",
              netWeight: "",
              number: "",
              postage: "",
              price: "",
              supplyPrice: "",
              specifications: element.split(","),
              specifications1: element,
              name: namelist,
              taxFlag: false,
              url: "",
            };
            this.tableData.push(data);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    doExchange(doubleArrays) {
      var len = doubleArrays.length;
      if (len >= 2) {
        var arr1 = doubleArrays[0];
        var arr2 = doubleArrays[1];
        var len1 = doubleArrays[0].length;
        var len2 = doubleArrays[1].length;
        var newlen = len1 * len2;
        var temp = new Array(newlen);
        var index = 0;
        for (var i = 0; i < len1; i++) {
          for (var j = 0; j < len2; j++) {
            temp[index] = arr1[i] + "," + arr2[j];
            index++;
          }
        }
        var newArray = new Array(len - 1);
        newArray[0] = temp;
        if (len > 2) {
          var _count = 1;
          for (var i = 2; i < len; i++) {
            newArray[_count] = doubleArrays[i];
            _count++;
          }
        }
        //console.log(newArray);
        return this.doExchange(newArray);
      } else {
        return doubleArrays[0];
      }
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
