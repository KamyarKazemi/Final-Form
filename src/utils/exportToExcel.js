import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = "https://json-backend-9caj.onrender.com/PatientInformation";

// 🚀 Save new patient to backend (with timestamp)
export const addPatientToStorage = async (patient) => {
  try {
    const res = await axios.post(API_URL, {
      ...patient,
      timestamp: new Date().toISOString(),
    });
    console.log("✅ Patient saved:", res.data);
  } catch (error) {
    console.error("❌ Failed to save patient:", error);
    alert("خطا در ذخیره اطلاعات بیمار");
  }
};

// 📦 Export patients submitted today as an XLSX file
export const exportPatientsForToday = async () => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const res = await axios.get(API_URL);
    const allPatients = res.data;

    const patients = allPatients.filter((p) => {
      const ts = p.timestamp || p.date || p.createdAt;
      return ts && ts.slice(0, 10) === today;
    });

    if (!patients.length) {
      alert("هیچ اطلاعاتی برای امروز ثبت نشده است.");
      return;
    }

    const localized = {
      firstName: "نام",
      lastName: "نام خانوادگی",
      idCode: "کد ملی",
      medicalRecordNumber: "شماره پرونده",
      age: "سن",
      phoneNumber: "شماره تماس",
      birthDate: "تاریخ تولد",
      fullAddress: "آدرس",
      insuranceCompany: "شرکت بیمه",
      insurancePolicyNumber: "شماره بیمه‌نامه",
      emergencyContactName: "نام تماس اضطراری",
      emergencyContactPhone: "شماره تماس اضطراری",
      secondEmergencyContactPhone: "شماره تماس اضطراری دوم",
      emergencyContactAddress: "آدرس تماس اضطراری",
      admissionWeight: "وزن",
      admissionHeight: "قد",
      vitalSignsOnAdmission: "علائم حیاتی",
      glasgowComaScale: "GCS",
      apacheScore: "APACHE II",
      selectedIcuReason: "علت ICU",
      selectedIcuReasonSubcategories: "علائم ICU",
      selectedPrimaryDiagnosis: "تشخیص اولیه",
      selectedPrimaryDiagnosisSubcategories: "تشخیص‌های فرعی",
      selectedComorbidity: "بیماری زمینه‌ای",
      selectedComorbiditySubcategories: "جزئیات بیماری زمینه‌ای",
      selectedSurgicalHistory: "سابقه جراحی",
      selectedSurgicalHistorySubcategories: "جزئیات جراحی",
      selectedMedication: "داروهای مصرفی",
      selectedMedicationSubcategories: "جزئیات داروها",
      selectedDrugAllergy: "آلرژی دارویی",
      selectedDrugAllergySubcategories: "جزئیات آلرژی",
      selectedIcuAdmissionReason: "دلایل بستری ICU",
      selectedIcuAdmissionReasonSubcategories: "جزئیات بستری ICU",
      bloodType: "گروه خونی",
      modeOfArrival: "شیوه ورود",
      referringDoctor: "پزشک ارجاع دهنده",
      bedNumber: "شماره تخت",
    };

    const formatted = patients.map((p) => {
      const row = {};
      Object.entries(localized).forEach(([key, label]) => {
        const val = p[key];
        row[label] = Array.isArray(val)
          ? val.length
            ? val.join("، ")
            : "ندارد"
          : val || "ندارد";
      });
      return row;
    });

    const sheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "بیماران");

    const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });

    saveAs(blob, `اطلاعات_بیمار_${today}.xlsx`);
  } catch (error) {
    console.error("❌ Export failed:", error);
    alert("خطا در دریافت اطلاعات بیماران.");
  }
};
