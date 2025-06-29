import { createContext, useState } from "react";
import axios from "axios";
import { addPatientToStorage } from "./utils/exportToExcel";

const FormContext = createContext();

const defaultFormData = {
  firstName: "",
  lastName: "",
  idCode: "",
  medicalRecordNumber: "",
  age: "",
  phoneNumber: "",
  birthDate: "",
  fullAddress: "",
  insuranceCompany: "",
  insurancePolicyNumber: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  secondEmergencyContactPhone: "",
  emergencyContactAddress: "",
  admissionWeight: "",
  admissionHeight: "",
  vitalSignsOnAdmission: "",
  glasgowComaScale: "",
  apacheScore: "",

  selectedIcuReason: "",
  selectedIcuSubReasons: [],
  selectedIcuReasonSubcategories: [],
  selectedPrimaryDiagnosisSubcategories: [],
  selectedComorbiditySubcategories: [],
  selectedSurgicalHistorySubcategories: [],
  selectedMedicationSubcategories: [],
  selectedDrugAllergySubcategories: [],
  selectedIcuAdmissionReasonSubcategories: [],

  selectedPrimaryDiagnosis: "",

  selectedComorbidity: "",
  selectedComorbiditiesSubcategories: [],

  selectedSurgicalHistory: "",

  selectedMedication: "",

  selectedDrugAllergy: "",
  selectedAllergySubcategories: [],

  selectedIcuAdmissionReason: "",
  selectedAdmissionReasonSubcategories: [],
  bloodType: "",
  modeOfArrival: "",
  referringDoctor: "",
  bedNumber: "",
};

function Provider({ children }) {
  const [formData, setFormData] = useState(defaultFormData);

  const def = {
    bloodTypes: [
      "A مثبت",
      "A منفی",
      "B مثبت",
      "B منفی",
      "AB مثبت",
      "AB منفی",
      "O مثبت",
      "O منفی",
    ],

    modeOfArrival: [
      "آمبولانس",
      "ارجاع از بخش دیگر",
      "مراجعه حضوری",
      "انتقال از بیمارستان دیگر",
      "ارجاع از درمانگاه",
      "حضور با نیروهای اورژانس",
      "انتقال هوایی",
      "ارجاع توسط پزشک خانوادگی",
    ],

    baseIcuReason: [
      {
        symptom: "سایر دلایل عمومی (Miscellaneous)",
        subSymptom: [
          "نارسایی حاد تنفسی (Acute Respiratory Failure)",
          "دیسترس تنفسی حاد (ARDS)",
          "تشدید آسم یا COPD مقاوم به درمان",
          "پنومونی شدید با کاهش اشباع اکسیژن",
          "آمبولی ریه (Pulmonary Embolism)",
          "انسداد راه هوایی (Obstruction of airway)",
          "نیاز به تهویه مکانیکی (Mechanical ventilation)",
        ],
      },

      {
        symptom: "دلایل قلبی‌عروقی (Cardiovascular Causes)",
        subSymptom: [
          "شوک قلبی (Cardiogenic Shock)",
          "سکته قلبی حاد وسیع (Massive Myocardial Infarction)",
          "آریتمی‌های تهدیدکننده حیات (VT/VF, Complete Heart Block)",
          "ایست قلبی (Cardiac Arrest, post-resuscitation care)",
          "نارسایی احتقانی قلب (Acute Decompensated Heart Failure)",
          "پریکاردیت یا تامپوناد قلبی",
          "فشار خون بسیار بالا یا بسیار پایین کنترل‌نشده",
        ],
      },

      {
        symptom: "دلایل نورولوژیک (Neurological Causes)",
        subSymptom: [
          "سکته مغزی (Stroke - Ischemic or Hemorrhagic)",
          "صرع مقاوم یا status epilepticus",
          "ترومای مغزی (Severe Traumatic Brain Injury)",
          "افزایش فشار داخل جمجمه (Increased ICP)",
          "کومای غیرقابل توضیح یا GCS پایین",
          "بیماری‌های نوروموسکولار پیشرفته (مثل گیلن باره)",
        ],
      },

      {
        symptom: "دلایل کلیوی (Renal Causes)",
        subSymptom: [
          "نارسایی حاد کلیوی نیازمند دیالیز اورژانسی",
          "اختلالات شدید الکترولیتی (مثل هایپرکالمی شدید)",
          "اسیدوز متابولیک شدید",
        ],
      },

      {
        symptom: "دلایل گوارشی (Gastrointestinal Causes)",
        subSymptom: [
          "خونریزی گوارشی شدید (GI bleeding with hemodynamic instability)",
          "پانکراتیت حاد شدید (Severe acute pancreatitis)",
          "پریتونیت عمومی یا سپسیس شکمی",
          "انسداد روده با خطر نکروز",
        ],
      },

      {
        symptom: "دلایل عفونی و سپتیک (Infectious/Sepsis)",
        subSymptom: [
          "سپسیس شدید و شوک سپتیک",
          "تب بالا با ناپایداری همودینامیک",
          "اندوکاردیت عفونی با عوارض",
          "پنومونی مقاوم همراه با سپسیس",
        ],
      },

      {
        symptom: "دلایل جراحی و تروما (Surgical/Trauma Causes)",
        subSymptom: [
          "ترومای چندگانه (Polytrauma)",
          "شکستگی لگن یا جمجمه با ناپایداری همودینامیک یا تنفسی",
          "خونریزی داخلی یا خارجی شدید",
          "بعد از جراحی‌های بزرگ مثل جراحی قلب، مغز یا شکم",
        ],
      },

      {
        symptom: "مسمومیت‌ها و اختلالات متابولیک",
        subSymptom: [
          "مسمومیت دارویی یا شیمیایی تهدیدکننده حیات",
          "اسیدوز لاکتیک یا کتواسیدوز دیابتی شدید",
          "هیپوگلیسمی یا هایپرگلیسمی شدید",
          "اختلالات سدیم/پتاسیم شدید",
        ],
      },

      {
        symptom: "سایر دلایل عمومی (Miscellaneous)",
        subSymptom: [
          "سوختگی‌های وسیع (Burns >30% TBSA)",
          "هایپوترمی یا هایپرترمی شدید",
          "بیماران نیازمند مانیتورینگ مداوم به دلایل پیش‌آگهی ضعیف",
        ],
      },
    ],

    vitalSigns: [
      {
        sign: "فشار خون (SBP)",
      },

      {
        sign: "تعداد تنفس	",
      },

      {
        sign: "اشباع اکسیژن (SpO₂)",
      },

      {
        sign: "ضربان قلب",
      },

      {
        sign: "دمای بدن",
      },

      {
        sign: "GCS (سطح هوشیاری)",
      },
    ],

    firstDiagnosis: [
      {
        diagnosis: "معیارهای تنفسی (Respiratory Red Flags)",
        subDiagnosis: [
          "دیسترس تنفسی شدید (retractions, accessory muscles use)",
          "نیاز فوری به تهویه مکانیکی",
          "برونشواسپاسم شدید مقاوم",
          "پنوموتوراکس تحت فشار",
          "صدای تنفس کاهش‌یافته یا غیاب صدا در یک ریه",
          "بالا بودن PaCO₂ و اسیدوز در ABG",
        ],
      },

      {
        diagnosis: "معیارهای قلبی‌عروقی",
        subDiagnosis: [
          "شوک (سردی اندام، تاخیر پرشدن مویرگی، فشار پایین)",
          "آریتمی تهدیدکننده زندگی (VF, VT, complete heart block)",
          "درد قفسه سینه شدید با علائم ناپایداری",
          "تنگی نفس با ادم حاد ریه",
          "فشار خون مقاوم به درمان یا فشار پایین پایدار",
        ],
      },

      {
        diagnosis: "اختلالات هوشیاری و عصبی",
        subDiagnosis: [
          "GCS ≤ 8",
          "تشنج ممتد یا برگشت‌پذیر نشده",
          "تغییر ناگهانی در رفتار/وضعیت روانی",
          "سکته مغزی مشکوک با ناپایداری",
          "افت هوشیاری بدون دلیل واضح",
          "سندرم Guillain-Barré با خطر درگیری تنفس",
        ],
      },

      {
        diagnosis: "شواهد سپسیس یا عفونت شدید",
        subDiagnosis: [
          "تب شدید با لرز و ناپایداری فشار",
          "وجود منبع عفونی + اختلال در عملکرد ≥1 ارگان",
          "لکوسیتوز شدید یا لکوپنی + علائم شوک",
          "لاکتات سرم بالا > 2 mmol/L",
          "نیاز به نرمال‌سالین > 2 لیتر بدون پاسخ همودینامیک",
        ],
      },

      {
        diagnosis: "معیارهای کلیوی / متابولیک",
        subDiagnosis: [
          "کراتینین ↑ سریع + کاهش ادرار (Oliguria/Anuria)",
          "پتاسیم > 6.5 mEq/L همراه با ECG abnormal",
          "اسیدوز شدید (pH < 7.2)",
          "نارسایی چند ارگانی (MODS)",
          "نیاز فوری به دیالیز اورژانسی",
        ],
      },

      {
        diagnosis: "تروما و خونریزی شدید",
        subDiagnosis: [
          "تروما با GCS پایین یا همودینامیک ناپایدار",
          "خونریزی داخلی/خارجی شدید (Hb↓ + شوک)",
          "هموپتیزی یا ملنا شدید با فشار پایین",
          "بعد از CPR موفق (Post-ROSC care)",
        ],
      },

      {
        diagnosis: "سایر شرایط ضروری",
        subDiagnosis: [
          "مسمومیت با دارو یا سم با تهدید تنفس/قلب",
          "سوختگی وسیع (>30%) یا همراه با استنشاق دود",
          "هیپوترمی یا هیپرترمی شدید مقاوم",
          "بعد از جراحی پرخطر همراه با بی‌ثباتی",
        ],
      },
    ],

    comorbidities: [
      {
        comorbiditie: "بیماری‌های قلبی و عروقی",
        subComorbiditie: [
          "فشار خون بالا (Hypertension)",
          "نارسایی قلبی (Heart Failure)",
          "بیماری عروق کرونر (Coronary Artery Disease)",
          "آریتمی قلبی (Arrhythmia)",
          "سکته قلبی (Myocardial Infarction)",
          "بیماری دریچه‌ای قلب (Valvular Heart Disease)",
          "کاردیومیوپاتی (Cardiomyopathy)",
          "فشار خون ریوی (Pulmonary Hypertension)",
        ],
      },

      {
        comorbiditie: "بیماری‌های تنفسی",
        subComorbiditie: [
          "آسم (Asthma)",
          "بیماری انسدادی مزمن ریه (COPD)",
          "فیبروز ریوی (Pulmonary Fibrosis)",
          "آمفیزم (Emphysema)",
          "آپنه خواب (Sleep Apnea)",
          "برونشکتازی (Bronchiectasis)",
        ],
      },

      {
        comorbiditie: "بیماری‌های متابولیک و غدد درون‌ریز",
        subComorbiditie: [
          "دیابت نوع ۱ و ۲ (Type 1 and 2 Diabetes Mellitus)",
          "کم‌کاری یا پرکاری تیروئید (Hypo/Hyperthyroidism)",
          "چاقی مفرط (Morbid Obesity)",
          "سندرم متابولیک (Metabolic Syndrome)",
          "بیماری کوشینگ (Cushing’s Syndrome)",
          "بیماری آدیسون (Addison’s Disease)",
        ],
      },

      {
        comorbiditie: "بیماری‌های کلیوی",
        subComorbiditie: [
          "نارسایی مزمن کلیه (CKD)",
          "سنگ کلیه مکرر (Recurrent Kidney Stones)",
          "نفروپاتی دیابتی (Diabetic Nephropathy)",
          "سندرم نفروتیک (Nephrotic Syndrome)",
          "دیالیز (Hemodialysis / Peritoneal Dialysis)",
        ],
      },

      {
        comorbiditie: "بیماری‌های گوارشی و کبدی",
        subComorbiditie: [
          "هپاتیت مزمن B و C (Chronic Hepatitis B/C)",
          "سیروز کبدی (Liver Cirrhosis)",
          "بیماری کبد چرب غیرالکلی (NAFLD)",
          "بیماری کرون (Crohn’s Disease)",
          "کولیت اولسراتیو (Ulcerative Colitis)",
          "زخم معده یا اثنی‌عشر (Peptic Ulcer Disease)",
        ],
      },

      {
        comorbiditie: "بیماری‌های عصبی و روانی",
        subComorbiditie: [
          "صرع (Epilepsy)",
          "سکته مغزی (Stroke)",
          "پارکینسون (Parkinson’s Disease)",
          "آلزایمر و دمانس (Dementia / Alzheimer’s)",
          "اختلال دو قطبی (Bipolar Disorder)",
          "افسردگی مزمن (Chronic Depression)",
          "اسکلروز متعدد (MS)",
        ],
      },

      {
        comorbiditie: "بیماری‌های ایمنی و خودایمنی",
        subComorbiditie: [
          "لوپوس (SLE)",
          "آرتریت روماتوئید (Rheumatoid Arthritis)",
          "اسکلرودرما",
          "سندرم شوگرن (Sjögren’s Syndrome)",
          "پسوریازیس شدید (Severe Psoriasis)",
          "بیماری سلیاک",
        ],
      },

      {
        comorbiditie: "بیماری‌های خونی و انکولوژیک",
        subComorbiditie: [
          "کم‌خونی داسی‌شکل (Sickle Cell Anemia)",
          "تالاسمی ماژور (Thalassemia Major)",
          "هموفیلی (Hemophilia)",
          "سرطان‌های فعال یا درمان‌شده (Active or Treated Cancers)",
          "لوسمی، لنفوم، میلوما",
          "اختلالات انعقادی (Coagulopathy)",
        ],
      },

      {
        comorbiditie: "بیماری‌های عفونی مزمن",
        subComorbiditie: [
          "HIV/AIDS",
          "سل فعال یا نهفته (TB)",
          "بیماری لایم (Lyme Disease)",
          "سیفلیس مزمن",
        ],
      },

      {
        comorbiditie: "بیماری‌های پوستی شدید",
        subComorbiditie: [
          "اگزمای شدید (Severe Eczema)",
          "پسوریازیس گسترده",
          "پمفیگوس",
        ],
      },

      {
        comorbiditie: "سایر بیماری‌ها و شرایط خاص",
        subComorbiditie: [
          "پیوند عضو (Organ Transplant)",
          "نقص سیستم ایمنی (Immunodeficiency)",
          "حاملگی پرخطر (High-Risk Pregnancy)",
          "بیماری‌های نادر ژنتیکی",
          "اعتیاد مزمن (Chronic Substance Abuse)",
          "ناباروری همراه با بیماری زمینه‌ای",
        ],
      },
    ],

    surgicalHistories: [
      {
        history: "جراحی‌های قلب و عروق",
        subHistory: [
          "جراحی بای‌پس عروق کرونر (CABG)",
          "آنژیوپلاستی یا استنت‌گذاری (Angioplasty / Stent)",
          "تعویض یا ترمیم دریچه قلب (Valve Replacement / Repair)",
          "کاردیومیوپاتی با دستگاه LVAD",
          "تعبیه پیس‌میکر یا دفیبریلاتور (Pacemaker / ICD)",
          "جراحی آئورت (Aortic Repair or Dissection Surgery)",
        ],
      },

      {
        history: "جراحی‌های مغز و اعصاب",
        subHistory: [
          "کرانیوتومی (Craniotomy)",
          "جراحی تومور مغزی (Brain Tumor Resection)",
          "جراحی ستون فقرات (Spinal Fusion / Discectomy / Laminectomy)",
          "درمان هیدروسفالی (Shunt Placement)",
          "درمان هیدروسفالی (Shunt Placement)",
        ],
      },

      {
        history: "جراحی‌های گوارشی",
        subHistory: [
          "آپاندکتومی (Appendectomy)",
          "کله‌سیستکتومی (Cholecystectomy – برداشتن کیسه صفرا)",
          "جراحی فتق (Hernia Repair – اینگوینال، نافی، فمورال)",
          "هموروئیدکتومی (Hemorrhoidectomy)",
          "کلکتومی (Colectomy – برداشتن بخشی از روده بزرگ)",
          "گاسترکتومی (Gastrectomy – برداشتن بخشی یا کل معده)",
          "جراحی رفلاکس (Fundoplication)",
          "پانکراتکتومی (Pancreatectomy)",
          "جراحی بای‌پس معده یا اسلیو معده (Gastric Bypass / Sleeve)",
        ],
      },

      {
        history: "جراحی‌های کبد، طحال و لوزالمعده",
        subHistory: [
          "برداشتن کیست کبدی",
          "اسپلنکتومی (Splenectomy – برداشتن طحال)",
          "رزکسیون پانکراس (Pancreatic Resection)",
          "بیوپسی کبدی (Liver Biopsy)",
        ],
      },

      {
        history: "جراحی‌های کلیه و مجاری ادراری",
        subHistory: [
          "نفرکتومی (Nephrectomy – برداشتن کلیه)",
          "سنگ‌شکنی یا برداشتن سنگ کلیه (PCNL / URS / Lithotripsy)",
          "تعبیه دابل جی یا کاتتر کلیوی",
          "پیوند کلیه (Kidney Transplant)",
          "سیستکتومی (برداشتن مثانه)",
          "پروستاتکتومی (برداشتن پروستات)",
        ],
      },

      {
        history: "جراحی‌های زنان و زایمان",
        subHistory: [
          "سزارین (C-Section)",
          "هیسترکتومی (برداشتن رحم)",
          "اوفورکتومی (برداشتن تخمدان)",
          "لاپاراسکوپی تشخیصی یا درمانی",
          "کورتاژ رحم (D&C)",
          "جراحی اندومتریوز",
          "جراحی بارداری خارج‌رحمی",
        ],
      },

      {
        history: "جراحی‌های ارتوپدی",
        subHistory: [
          "تعویض مفصل (هیپ، زانو، شانه) – Total Joint Replacement",
          "فیکساسیون شکستگی (ORIF – Open Reduction Internal Fixation)",
          "آرتروسکوپی زانو / شانه",
          "جراحی رباط ACL / منیسک",
          "آمنیوتومی ستون فقرات",
        ],
      },

      {
        history: "جراحی‌های گوش، حلق و بینی (ENT)",
        subHistory: [
          "تونسیلکتومی (برداشتن لوزه)",
          "آدنوئیدکتومی (برداشتن لوزه سوم)",
          "جراحی سینوس (Sinus Surgery)",
          "سپتوپلاستی یا انحراف بینی",
          "جراحی گوش میانی / کاشت حلزون",
        ],
      },

      {
        history: " جراحی‌های چشم",
        subHistory: [
          "عمل آب مروارید (Cataract Surgery)",
          "عمل لازک یا لیزیک",
          "جراحی گلوکوم",
          "شبکیه‌برداری یا ترمیم پارگی شبکیه",
        ],
      },

      {
        history: "جراحی‌های پوست و زیبایی",
        subHistory: [
          "جراحی پلاستیک و ترمیمی (Reconstructive Surgery)",
          "برداشت تومور یا کیست پوست",
          "پیوند پوست (Skin Graft)",
          "جراحی زیبایی بینی (Rhinoplasty)",
          "لیپوساکشن / ابدومینوپلاستی (Liposuction / Tummy Tuck)",
          "ماموپلاستی (افزایش/کاهش سینه)",
        ],
      },

      {
        history: "جراحی‌های انکولوژیک (سرطان‌ها)",
        subHistory: [
          "رزکسیون تومور (هر ناحیه)",
          "ماستکتومی (برداشتن پستان)",
          "جراحی کولورکتال برای سرطان روده",
          "جراحی پروستات برای سرطان",
          "برداشت غدد لنفاوی (Lymphadenectomy)",
        ],
      },

      {
        history: "سایر جراحی‌های رایج",
        subHistory: [
          "پیوند عضو (کلیه، کبد، قلب)",
          "تعبیه پورت مرکزی (Port / Central Line Placement)",
          "آمپوتاسیون عضو (Amputation)",
          "ترمیم زخم‌های وسیع (Debridement)",
          "جراحی آندوسکوپیک دستگاه گوارش",
        ],
      },
    ],

    icuAdmissionReasons: [
      {
        reason: "مشکلات قلبی و عروقی",
        subReason: [
          "سکته قلبی (Acute Myocardial Infarction – MI)",
          "نارسایی شدید قلبی (Acute Heart Failure)",
          "آریتمی‌های خطرناک (Life-threatening Arrhythmias)",
          "شوک قلبی (Cardiogenic Shock)",
          "تامپوناد قلبی (Cardiac Tamponade)",
          "فشار خون بسیار بالا یا پایین (Hypertensive Crisis / Hypotension)",
        ],
      },

      {
        reason: "اختلالات تنفسی",
        subReason: [
          "نارسایی حاد تنفسی (Acute Respiratory Failure)",
          "پنومونی شدید (Severe Pneumonia)",
          "ARDS (سندرم دیسترس حاد تنفسی)",
          "COPD شدید یا حمله آسم شدید",
          "آمبولی ریه (Pulmonary Embolism)",
          "نیاز به تهویه مکانیکی (Mechanical Ventilation)",
        ],
      },

      {
        reason: "بیماری‌های مغز و اعصاب",
        subReason: [
          "سکته مغزی (Stroke – ایسکمیک یا هموراژیک)",
          "تشنج‌های مکرر یا استاتوس اپی‌لپتیکوس",
          "افزایش فشار داخل جمجمه (ICP)",
          "تروما یا ضربه به سر (Head Injury)",
          "خونریزی ساب‌آراکنوئید",
          "گیلن باره یا نوروپاتی‌های پیش‌رونده",
        ],
      },

      {
        reason: "شوک‌ها و وضعیت‌های اورژانسی",
        subReason: [
          "شوک سپتیک (Septic Shock)",
          "شوک آنافیلاکسی (Anaphylactic Shock)",
          "شوک هیپوولمیک (Hypovolemic Shock)",
          "مولتی ارگان فیلر (MODS – Multi Organ Dysfunction Syndrome)",
        ],
      },

      {
        reason: "اختلالات متابولیک و کلیوی",
        subReason: [
          "اسیدوز یا آلکالوز شدید",
          "دیابت کنترل‌نشده (Ketoacidosis / HHS)",
          "نارسایی حاد کلیه (Acute Kidney Injury)",
          "الکترولیت‌درهم‌ریختگی شدید (Hyperkalemia / Hyponatremia)",
          "نیاز به دیالیز اورژانسی",
        ],
      },

      {
        reason: "مسمومیت‌ها و اختلالات دارویی",
        subReason: [
          "مصرف بیش از حد دارو (Overdose)",
          "مسمومیت با مواد شیمیایی یا گازهای سمی",
          "اعتیاد شدید همراه با علائم ترک",
          "مصرف ترکیبی داروهای آرام‌بخش / مخدر / الکل",
        ],
      },

      {
        reason: "عفونت‌ها و بیماری‌های سیستمیک",
        subReason: [
          "سپسیس (Sepsis)",
          "مننژیت باکتریایی یا ویروسی",
          "اندوکاردیت عفونی",
          "عفونت‌های سیستمیک با ارگانیسم‌های مقاوم",
          "کوید-۱۹ با درگیری ریوی و هایپوکسی شدید",
        ],
      },

      {
        reason: "بعد از اعمال جراحی سنگین",
        subReason: [
          "جراحی قلب باز",
          "جراحی مغز و اعصاب",
          "پیوند عضو (کبد، قلب، کلیه)",
          "جراحی‌های بزرگ شکمی (Colectomy, Whipple, etc.)",
          "جراحی با خونریزی شدید یا عدم تعادل همودینامیک",
        ],
      },

      {
        reason: "تروما و صدمات شدید",
        subReason: [
          "تصادفات شدید رانندگی",
          "سقوط از ارتفاع",
          "سوختگی وسیع (Burn > 20% TBSA)",
          "تروماهای نافذ (گلوله، چاقو)",
          "شکستگی‌های باز و پیچیده همراه با شوک",
        ],
      },

      {
        reason: "وضعیت‌های زنان و زایمان در ICU",
        subReason: [
          "پره‌اکلامپسی / اکلامپسی شدید",
          "خونریزی پس از زایمان (PPH)",
          "شوک ناشی از بارداری خارج‌رحمی",
          "سپسیس بعد از زایمان",
          "عوارض ناشی از جراحی سزارین",
        ],
      },

      {
        reason: "وضعیت‌های خاص و نادر",
        subReason: [
          "هیپرترمی بدخیم (Malignant H,yperthermia)",
          "سندرم آنتی‌فسفولیپید شدید",
          "بحران میاستنی (Myasthenic Crisis)",
          "سندرم گیلن‌باره پیشرونده",
          "نارسایی کبدی حاد (Acute Liver Failure)",
        ],
      },
    ],

    usedDrugs: [
      {
        drug: "داروهای قلبی و عروقی",
        subDrug: [
          "Aspirin (آسپرین)",
          "Clopidogrel (Plavix) – ضد پلاکت",
          "Warfarin – ضد انعقاد",
          "Heparin / Enoxaparin (Clexane) – ضد انعقاد",
          "Nitroglycerin – نیتروگلیسیرین برای آنژین",
          "Beta blockers: Metoprolol, Atenolol",
          "ACE Inhibitors: Captopril, Enalapril, Lisinopril",
          "ARBs: Losartan, Valsartan",
          "Calcium Channel Blockers: Amlodipine, Diltiazem",
          "Diuretics: Furosemide (Lasix), Spironolactone",
          "Digoxin – برای نارسایی قلبی و آریتمی",
        ],
      },

      {
        drug: "داروهای تنفسی",
        subDrug: [
          "Salbutamol (Ventolin) – اسپری یا نبولایزر",
          "Ipratropium (Atrovent",
          "Theophylline",
          "Corticosteroids: Prednisolone, Dexamethasone",
          "Montelukast – ضد آسم",
          "Oxygen Therapy (تجویزی)",
          "Antibiotics for Pneumonia: Azithromycin, Ceftriaxone, Piperacillin-Tazobactam",
        ],
      },

      {
        drug: "داروهای اعصاب و روان",
        subDrug: [
          "Phenytoin, Levetiracetam (Keppra) – ضد تشنج",
          "Diazepam / Lorazepam / Midazolam – آرام‌بخش/ضد اضطراب",
          "Haloperidol – آنتی‌سایکوتیک",
          "Risperidone, Olanzapine",
          "Sertraline, Fluoxetine (SSRIs)",
          "Lithium – در بیماران با اختلال دوقطبی",
          "Morphine / Methadone / Buprenorphine – مسکن و جایگزین اپیوئید",
        ],
      },

      {
        drug: "داروهای دیابت و متابولیک",
        subDrug: [
          "Insulin (Humulin, Lantus, Novorapid)",
          "Metformin",
          "Gliclazide / Glibenclamide",
          "SGLT2 inhibitors: Empagliflozin, Dapagliflozin",
          "Corticosteroids – در موارد نارسایی آدرنال یا التهاب شدید",
        ],
      },

      {
        drug: "آنتی‌بیوتیک‌ها و داروهای ضد عفونت",
        subDrug: [
          "Ceftriaxone / Cefepime / Ceftazidime",
          "Meropenem / Imipenem",
          "Vancomycin",
          "Linezolid",
          "Azithromycin / Clarithromycin",
          "Metronidazole",
          "Fluconazole, Amphotericin B – ضد قارچ",
          "Oseltamivir (Tamiflu) – آنفلوآنزا",
          "Remdesivir, Favipiravir – کووید-۱۹",
        ],
      },

      {
        drug: "داروهای معده و گوارش",
        subDrug: [
          "Pantoprazole / Omeprazole (PPI)",
          "Ranitidine / Famotidine",
          "Lactulose – برای آنسفالوپاتی کبدی",
          "Domperidone / Metoclopramide – ضد تهوع",
          "Loperamide – ضد اسهال",
          "Mesalazine – بیماری‌های التهابی روده",
        ],
      },

      {
        drug: "داروهای ضد انعقاد و ترومبولیتیک",
        subDrug: [
          "Warfarin, Heparin, Enoxaparin",
          "Apixaban, Rivaroxaban, Dabigatran – ضد انعقاد خوراکی جدید",
          "Alteplase (tPA) – ترومبولیتیک برای سکته",
        ],
      },

      {
        drug: "داروهای کلیوی و الکترولیتی",
        subDrug: [
          "Sodium bicarbonate",
          "Potassium Chloride (خوراکی یا تزریقی)",
          "Calcium Gluconate",
          "Sodium Polystyrene Sulfonate (Kayexalate) – برای هایپرکالمی",
          "Sevelamer, Calcitriol – بیماران دیالیزی",
          "Erythropoietin (EPO) – در نارسایی مزمن کلیه",
        ],
      },

      {
        drug: "داروهای سرکوب ایمنی و سرطان",
        subDrug: [
          "Prednisolone / Methylprednisolone",
          "Azathioprine",
          "Mycophenolate Mofetil (CellCept)",
          "Tacrolimus / Cyclosporine",
          "Methotrexate, Cyclophosphamide",
          "Chemotherapy agents – Cisplatin, Doxorubicin, etc.",
        ],
      },

      {
        drug: "داروهای دیگر مهم و خاص",
        subDrug: [
          "Naloxone – آنتاگونیست اپیوئید",
          "Flumazenil – آنتاگونیست بنزودیازپین",
          "IVIG (ایمونوگلوبولین تزریقی) – در بیماری‌های خودایمنی",
          "Antihistamines – مانند Diphenhydramine, Loratadine",
          "Adrenaline / Epinephrine – آنافیلاکسی یا CPR",
          "Hydrocortisone – شوک آدرنال",
        ],
      },
    ],

    drugAllergies: [
      {
        allergy: "آنتی‌بیوتیک‌ها",
        subAllergy: [
          "Penicillin / Ampicillin / Amoxicillin",
          "Cephalosporins: Cefalexin, Ceftriaxone, Cefepime",
          "Carbapenems: Meropenem, Imipenem",
          "Sulfonamides: Cotrimoxazole (Trimethoprim + Sulfamethoxazole)",
          "Macrolides: Erythromycin, Azithromycin",
          "Fluoroquinolones: Ciprofloxacin, Levofloxacin",
          "Vancomycin",
          "Clindamycin",
          "Tetracyclines: Doxycycline",
        ],
      },

      {
        allergy: "مسکن‌ها و ضدالتهاب‌ها",
        subAllergy: [
          "NSAIDs: Ibuprofen, Diclofenac, Naproxen",
          "Aspirin",
          "Paracetamol (نادر، اما ممکن)",
          "Opioids: Morphine, Codeine, Tramadol, Fentanyl",
          "Ketorolac",
        ],
      },

      {
        allergy: "بی‌حس‌کننده‌ها و بیهوشی",
        subAllergy: [
          "Lidocaine (موضعی)",
          "Bupivacaine",
          "Propofol",
          "Etomidate",
          "Midazolam / Diazepam (بیشتر حساسیت‌های خفیف یا واکنش‌های شبه آلرژیک)",
        ],
      },

      {
        allergy: "ضدتشنج و روان‌پزشکی",
        subAllergy: [
          "Phenytoin",
          "Carbamazepine – واکنش‌های شدید مانند SJS/TEN",
          "Lamotrigine",
          "Valproic acid",
          "Haloperidol",
          "Lithium",
        ],
      },

      {
        allergy: "انسولین‌ها و داروهای دیابت",
        subAllergy: [
          "Insulin human / analogs: ممکن است در برخی افراد حساسیت داده باشند",
          "Metformin",
          "Sulfonylureas: Gliclazide, Glibenclamide (ممکن است در بیماران حساس به سولفا مشکل ایجاد کنند)",
        ],
      },

      {
        allergy: "سرکوب‌کننده‌های ایمنی و ضدسرطان",
        subAllergy: [
          "Methotrexate",
          "Cyclophosphamide",
          "Azathioprine",
          "Rituximab",
          "IVIG (ایمونوگلوبولین تزریقی) – حساسیت شدید در برخی بیماران",
        ],
      },

      {
        allergy: "داروهای ضد HIV و ویروسی",
        subAllergy: [
          "Nevirapine",
          "Abacavir – تست ژنتیکی HLA-B*5701 قبل از مصرف توصیه می‌شود",
          "Efavirenz",
          "Oseltamivir",
        ],
      },

      {
        allergy: "سایر موارد شایع یا خاص",
        subAllergy: [
          "Heparin / Enoxaparin – می‌توانند باعث HIT (Heparin-induced Thrombocytopenia) یا حساسیت شوند",
          "Contrast media (مواد حاجب) – به‌خصوص در CT یا آنژیوگرافی",
          "Protamine – در بیماران دیالیزی یا با سابقه ماهیگیری آلرژی‌زا",
          "Vaccine-related allergies",
          "Iron sucrose / Iron dextran",
          "Thiamine",
        ],
      },
    ],

    insuranceCompanyOptions: [
      "تامین اجتماعی",
      "خدمات درمانی",
      "نیروهای مسلح",
      "کمیته امام خمینی",
      "بیمه خصوصی",
      "فاقد بیمه",
      "سلامت ایرانیان",
    ],

    emergencyContactRelationshipOptions: [
      "همسر",
      "والدین",
      "فرزند",
      "خواهر/برادر",
      "سایر اقوام",
      "دوست",
      "قیم قانونی ",
    ],

    ventilatorRequirementsOptions: [
      "عدم نیاز",
      "غیرتهاجمی (CPAP/BiPAP)",
      "تهاجمی (لوله تراشه)",
      "اکسیژن جریان بالا ",
    ],
    isolationPrecautionsOptions: [
      "عدم نیاز",
      "تماسی",
      "قطرات",
      "هوابرد",
      "محافظتی",
    ],

    admissionSourceOptions: [
      "اورژانس",
      "انتقال از بخش",
      "اتاق عمل",
      "بیمارستان دیگر",
      "منزل",
      "کلینیک",
    ],

    languagePreferenceOptions: [
      "فارسی",
      "انگلیسی",
      "عربی",
      "ترکی",
      "کردی",
      "سایر",
    ],

    advanceDirectivesOptions: [
      "کد کامل",
      "عدم احیاء (DNR)",
      "عدم لوله‌گذاری (DNI)",
      "مراقبت‌های تسکینی",
      "نامشخص",
    ],
  };

  const [isAnyError, setIsAnyError] = useState(false);
  const [idError, setIdError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [medicalRecordError, setMedicalRecordError] = useState(false);
  const [insuranceError, setInsuranceError] = useState(false);
  const [emergancyContactNameError, setEmergencyContactNameError] =
    useState(false);
  const [emergencyContactError, setEmergencyContactError] = useState(false);
  const [secondEmergencyContactError, setSecondEmergencyContactError] =
    useState(false);
  const [weightError, setWeightError] = useState(false);
  const [heightError, setHeightError] = useState(false);
  const [vitalSignsError, setVitalSignsError] = useState(false);
  const [glasgowError, setGlasgowError] = useState(false);
  const [apacheError, setApacheError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIdCode = (e) => {
    const cleaned = e.target.value
      .replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 1728)
      )
      .replace(/\D/g, "")
      .slice(0, 10);

    setIdError(cleaned.length !== 10);
    setFormData((prev) => ({ ...prev, idCode: cleaned }));
  };

  const handleBedNum = (e) => {
    const cleaned = e.target.value.replace(/[\u06F0-\u06F9]/g, (d) =>
      String.fromCharCode(d.charCodeAt(0) - 1728)
    );

    setFormData((prev) => ({ ...prev, bedNumber: cleaned }));
  };

  const handleMedicalRecordNumber = (e) => {
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9\u06F0-\u06F9]/g, "");

    setMedicalRecordError(cleaned.length < 4 || cleaned.length > 20);
    setFormData((prev) => ({ ...prev, medicalRecordNumber: cleaned }));
  };

  const handlePhoneNumber = (e) => {
    const input = e.target.value
      .replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 1728)
      )
      .replace(/\D/g, "")
      .slice(0, 11);

    const isValid =
      (input.length === 11 && /^09\d{9}$/.test(input)) ||
      (input.length === 10 && /^9\d{9}$/.test(input));

    setPhoneNumberError(!isValid);
    setFormData((prev) => ({ ...prev, phoneNumber: input }));
  };

  const handleName = (e) => {
    const { name, value } = e.target;
    const cleaned = value.replace(/[^a-zA-Zآ-ی\s]/g, "");
    setFormData((prev) => ({ ...prev, [name]: cleaned }));
  };

  const handleAge = (e) => {
    const cleaned = e.target.value
      .replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 1728)
      )
      .replace(/\D/g, "")
      .slice(0, 3);

    const age = parseInt(cleaned, 10);
    setIsAnyError(age <= 0 || age > 120);
    setAgeError(age <= 0 || age > 120);
    setFormData((prev) => ({ ...prev, age: cleaned }));
  };

  const handleInsurancePolicyNumber = (e) => {
    const cleaned = e.target.value
      .replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 1728)
      )
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 10);

    setInsuranceError(cleaned.length !== 10);
    setFormData((prev) => ({ ...prev, insurancePolicyNumber: cleaned }));
  };

  const handleEmergencyContactName = (e) => {
    const cleaned = e.target.value.replace(/[^a-zA-Zآ-ی\s]/g, "");
    setEmergencyContactNameError(!cleaned);
    setFormData((prev) => ({ ...prev, emergencyContactName: cleaned }));
  };
  const handleDoctor = (e) => {
    const cleaned = e.target.value.replace(/[^a-zA-Zآ-ی\s]/g, "");
    setFormData((prev) => ({ ...prev, referringDoctor: cleaned }));
  };

  const handleEmergencyContactPhone = (e) => {
    const input = e.target.value
      .replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 1728)
      )
      .replace(/\D/g, "")
      .slice(0, 11);

    const isValid =
      (input.length === 11 && /^09\d{9}$/.test(input)) ||
      (input.length === 10 && /^9\d{9}$/.test(input));

    setEmergencyContactError(!isValid);
    setFormData((prev) => ({ ...prev, emergencyContactPhone: input }));
  };

  const handleSecondEmergencyContactPhone = (e) => {
    const input = e.target.value
      .replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 1728)
      )
      .replace(/\D/g, "")
      .slice(0, 11);

    const isValid =
      (input.length === 11 && /^09\d{9}$/.test(input)) ||
      (input.length === 10 && /^9\d{9}$/.test(input));

    setSecondEmergencyContactError(!isValid);
    setFormData((prev) => ({ ...prev, secondEmergencyContactPhone: input }));
  };

  const handleWeight = (e) => {
    const value = e.target.value
      .replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 1728)
      )
      .replace(/\D/g, "")
      .slice(0, 3);

    setWeightError(value <= 0 || value > 500);
    setFormData((prev) => ({ ...prev, admissionWeight: value }));
  };

  const handleHeight = (e) => {
    const value = e.target.value
      .replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 1728)
      )
      .replace(/\D/g, "")
      .slice(0, 3);

    setHeightError(value <= 0 || value > 300);
    setFormData((prev) => ({ ...prev, admissionHeight: value }));
  };

  const handleVitalSigns = (e) => {
    const { value } = e.target;
    setVitalSignsError(!value);
    setFormData((prev) => ({ ...prev, vitalSignsOnAdmission: value }));
  };

  const handleGlasgowComaScale = (e) => {
    const val = e.target.value
      .replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 1728)
      )
      .replace(/\D/g, "")
      .slice(0, 2);

    setGlasgowError(val < 3 || val > 15);
    setFormData((prev) => ({ ...prev, glasgowComaScale: val }));
  };

  const handleApacheScore = (e) => {
    const val = e.target.value
      .replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 1728)
      )
      .replace(/\D/g, "")
      .slice(0, 2);

    setApacheError(val < 0 || val > 71);
    setFormData((prev) => ({ ...prev, apacheScore: val }));
  };

  const [years, setYears] = useState([]);
  const [months] = useState([
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [days, setDays] = useState([]);

  const handleYearChange = (e) => {
    const year = e.target.value;
    setFormData((prev) => ({
      ...prev,
      birthDate: `${year}/${selectedMonth || ""}/${
        prev.birthDate?.split("/")?.[2] || ""
      }`,
    }));
  };

  const handleMonthChange = (e) => {
    const monthName = e.target.value;
    setSelectedMonth(monthName);

    const daysInPersianMonth = {
      فروردین: 31,
      اردیبهشت: 31,
      خرداد: 31,
      تیر: 31,
      مرداد: 31,
      شهریور: 31,
      مهر: 30,
      آبان: 30,
      آذر: 30,
      دی: 30,
      بهمن: 30,
      اسفند: 29,
    };

    const daysCount = daysInPersianMonth[monthName] || 0;
    setDays(Array.from({ length: daysCount }, (_, i) => i + 1));
  };

  const handleDayChange = (e) => {
    const day = e.target.value;
    setFormData((prev) => {
      const [year = "", month = ""] = prev.birthDate?.split("/") || [];
      return { ...prev, birthDate: `${year}/${month}/${day}` };
    });
  };

  const handleCheckboxChange = (category, value, isChecked) => {
    const fieldName =
      category === "bloodTypes"
        ? "bloodTypes"
        : `selected${category}Subcategories`;

    setFormData((prev) => {
      const currentSelections = prev[fieldName] || [];
      if (isChecked) {
        if (!currentSelections.includes(value)) {
          return { ...prev, [fieldName]: [...currentSelections, value] };
        }
      } else {
        return {
          ...prev,
          [fieldName]: currentSelections.filter((item) => item !== value),
        };
      }
      return prev;
    });
  };

  const handleMainCategoryChange = (category, value) => {
    const mainFieldName = `selected${category}`;
    setFormData((prev) => ({
      ...prev,
      [mainFieldName]: value,
    }));
  };

  const hasErrors =
    idError ||
    phoneNumberError ||
    medicalRecordError ||
    insuranceError ||
    emergencyContactError ||
    secondEmergencyContactError ||
    weightError ||
    heightError ||
    vitalSignsError ||
    glasgowError ||
    apacheError ||
    ageError;

  const postFormData = async () => {
    try {
      const response = await axios.post(
        "https://json-backend-9caj.onrender.com/PatientInformation",
        formData
      );
      console.log("✅ Data submitted successfully:", response.data);
      addPatientToStorage(formData);
      return { success: true };
    } catch (error) {
      console.error("❌ Submission failed:", error);
      return { success: false, error };
    }
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        handleInputChange,
        handleIdCode,
        handleMedicalRecordNumber,
        handlePhoneNumber,
        handleName,
        handleAge,
        handleInsurancePolicyNumber,
        handleEmergencyContactPhone,
        handleSecondEmergencyContactPhone,
        handleWeight,
        handleHeight,
        handleVitalSigns,
        handleGlasgowComaScale,
        handleApacheScore,
        handleYearChange,
        years,
        setYears,
        handleMonthChange,
        months,
        selectedMonth,
        handleDayChange,
        days,
        isAnyError,
        idError,
        phoneNumberError,
        medicalRecordError,
        insuranceError,
        emergencyContactError,
        secondEmergencyContactError,
        weightError,
        heightError,
        vitalSignsError,
        glasgowError,
        apacheError,
        postFormData,
        handleCheckboxChange,
        handleMainCategoryChange,
        def,
        ageError,
        hasErrors,
        setIsAnyError,
        handleEmergencyContactName,
        emergancyContactNameError,
        handleDoctor,
        handleBedNum,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export { Provider };
export default FormContext;
