import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    isLoading: false,
    showModal: false,
    currentBrand: "BRAND",
    windowWidth: 0,
    isMobile: false,
    currentLanguage: 1,
    className: ["en", "zh", "sc", "jp"],
    // 地圖zoomin位置
    markerClicked: false,
    flyto: [],
    flytocountry: "",
    // API資料
    languagesData: [],
    homeData: [],
    aboutData: [],
    newsCategoryData: [],
    newsListData: [],
    newsDetailData: [],
    faqData: [],
    serviceData: [],
    marketsData: [],
    searchMarketsData: [],
    productBrandsData: [],
    productListData: [],
    showProductListData: [],
    homeShowProductListData: [],
    currentProduct: [],
    productData: [],
    // nav跟footer多語系
    navButtons: [
      {
        HOME: "HOME",
        ABOUT: "ABOUT",
        PRODUCT: "PRODUCT",
        NEWS: "NEWS",
        FAQ: "FAQS",
        WHERETOBUY: "WHERE TO BUY",
      },
      {
        HOME: "首頁",
        ABOUT: "關於我們",
        PRODUCT: "產品介紹",
        NEWS: "最新消息",
        FAQ: "常見問題與聯繫",
        WHERETOBUY: "通路介紹",
      },
      {
        HOME: "主页",
        ABOUT: "关于我们",
        PRODUCT: "产品",
        NEWS: "新闻动态",
        FAQ: "常见问题与联系方式",
        WHERETOBUY: "购买途径",
      },
      {
        HOME: "ホーム",
        ABOUT: "会社概要",
        PRODUCT: "製品情報",
        NEWS: "ニュース",
        FAQ: "サポート",
        WHERETOBUY: "お取り扱い店舗",
      },
    ],
    nevFind: [
      {
        pc: {
          name: "FIND YOUR PERFECT TIPS",
        },
        mobile: {
          name: "FIND YOUR TIPS",
        },
      },
      {
        pc: {
          name: "確認您適合的型號",
        },
        mobile: {
          name: "確認您適合的型號",
        },
      },
      {
        pc: {
          name: "尋找适用于您设备的SpinFit耳塞硅胶套建议",
        },
        mobile: {
          name: "尋找适用于您设备的SpinFit耳塞硅胶套建议",
        },
      },
      {
        pc: {
          name: "型番名検索",
        },
        mobile: {
          name: "型番名検索",
        },
      },
    ],
    shareButton: [
      [
        { name: "fb", address: "https://www.facebook.com/SpinFit.official" },
        { name: "ig", address: "https://www.instagram.com/spinfit.official/" },
        { name: "twitter", address: "https://twitter.com/spinfitofficial" },
      ],
      [
        { name: "fb", address: "https://www.facebook.com/SpinFitLab.Beta" },
        { name: "ig", address: "https://www.instagram.com/spinfit.official/" },
        { name: "twitter", address: "https://twitter.com/spinfitofficial" },
      ],
      [
        { name: "fb", address: "https://www.facebook.com/SpinFit.official" },
        { name: "ig", address: "https://www.instagram.com/spinfit.official/" },
        { name: "twitter", address: "https://twitter.com/spinfitofficial" },
        { name: "weibo", address: "https://weibo.com/n/SpinFit_official" },
      ],
      [
        { name: "fb", address: "https://www.facebook.com/SpinFit.official" },
        { name: "ig", address: "https://www.instagram.com/spinfit.official/" },
        { name: "twitter", address: "https://twitter.com/SpinFit_JP" },
      ],
    ],
    //產品多語系
    product: [
      {
        subtitle: "Find your eartips.",
        brand: "BRAND",
        model: "MODEL",
        alertText: {
          top: "Select from the dropdown menu or enter the brand and model.",
          bottom: "*Only supports alphanumeric characters.",
        },
        noMatch: "No ear tip model is compatible now.",
      },
      {
        subtitle: "尋找適合的耳塞",
        brand: "品牌",
        model: "型號",
        alertText: {
          top: "請下拉選單或輸入品牌及型號.",
          bottom: "*僅支援半角英數",
        },
        noMatch: "暫無適用的耳塞型號",
      },
      {
        subtitle: "寻找适配的耳塞",
        brand: "品牌",
        model: "型号",
        alertText: {
          top: "请下拉选单或输入品牌及型号",
          bottom: "*仅支援半角英数",
        },
        noMatch: "暂无适用的耳塞套型号",
      },
      {
        subtitle: "イヤーピースを探す",
        brand: "ブランド",
        model: "型番",
        alertText: {
          top: "プルダウンリストで探す・ブランドや型番を入力して探す",
          bottom: "*入力する際にUSキーボードに切り替えてください",
        },
        noMatch: "対応型番はありません",
      },
    ],
    //Modal多語系
    modal: [
      {
        title: "Find Tips for Your Device",
      },
      {
        title: "為您的耳機尋找適合的SpinFit耳塞",
      },
      {
        title: "为您的设备寻找SpinFit耳塞套建议",
      },
      {
        title: "お手持ちのイヤホンから選びます",
      },
    ],
    //faq多語系
    service: [
      {
        name: "Your Name",
        mail: "Email Address",
        subject: "Select a subject",
        subjectOptions: ["General Infomation", "Compatibility", "Business Inquiry"],
        brand: "Earphone Brand",
        brand_model: "Earphone Model",
        country: "Which country / region are you located in?",
        wherebuy: "Where did you buy our eartips?",
        message: "Message",
        whereknow: "Where did you hear about us?",
        upload: "Upload Images",
        reference: "Reference Link",
        submit: "Submit",
        success: "Your inquiry has been successfully submitted.",
        fail: "*Indicates required field.",
        messageAlert: "Message length: Max 1000 characters.",
        imgAlert: "Accepted image formats: JPG, PNG, GIF, max size 5MB.",
      },
      {
        name: "姓名",
        mail: "Email",
        subject: "諮詢主題",
        subjectOptions: ["一般資訊", "對應耳機型號問題", "業務洽詢"],
        brand: "耳機品牌",
        brand_model: "耳機型號",
        country: "國家/地區",
        wherebuy: "購入的店家/平台",
        message: "留下您的訊息",
        whereknow: "從何處得知SpinFit",
        upload: "上傳圖片",
        reference: "相關連結",
        submit: "完成送出",
        success: "資料已成功送出",
        fail: "*為必填內容",
        messageAlert: "訊息字數限1000字內。",
        imgAlert: "圖片格式限JPG、PNG、GIF，檔案大小限5M以下。",
      },
      {
        name: "姓名",
        mail: "Email",
        subject: "谘询主题",
        subjectOptions: ["一般资讯", "对应耳机型号问题", "业务洽询"],
        brand: "耳机品牌",
        brand_model: "耳机型号",
        country: "国家/地区",
        wherebuy: "购入的店家/平台",
        message: "留下您的讯息",
        whereknow: "从何处得知SpinFit",
        upload: "上传图片",
        reference: "相关连结",
        submit: "完成送出",
        success: "资料已成功送出",
        fail: "*为必填内容",
        messageAlert: "信息字数限1000字内。",
        imgAlert: "上传图片支持JPG、PNG、GIF格式，大小不超过5M。",
      },
      {
        name: "お名前",
        mail: "メール",
        subject: "問題のカテゴリー",
        subjectOptions: [
          "一般のお問い合わせ",
          "対応機種のお問い合わせ",
          "ビジネスに関するお問い合わせ",
        ],
        brand: "ブランド",
        brand_model: "型番・モデル",
        country: "国/地域",
        wherebuy: "ご購入店舗",
        message: "問題をこちらにご入力ください",
        whereknow: "どこでSpinFitを知りましたか？",
        upload: "画像アップデート",
        reference: "リンク",
        submit: "送信",
        success: "お問い合わせ内容をお送り致しました。",
        fail: "*必須項目",
        messageAlert: "1,000文字以内",
        imgAlert:
          "PNG、JPEG、GIF形式のファイルのみアップロードできます。ファイルサイズは5MB以下である必要があります。",
      },
    ],
  }),
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        storage: sessionStorage,
        paths: [
          "currentLanguage",
          "languagesData",
          "aboutData",
          "homeData",
          "newsCategoryData",
          "newsListData",
          "newsDetailData",
          "faqData",
          "serviceData",
          "marketsData",
          "searchMarketsData",
          "productBrandsData",
          "productListData",
          "showProductListData",
          "homeShowProductListData",
          "currentProduct",
          "productData",
        ],
      },
    ],
  },
});
