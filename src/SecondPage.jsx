import { useContext } from "react";
import FormContext from "./FormContext";
import { exportPatientsForToday } from "./utils/exportToExcel";
import { useNavigate } from "react-router-dom";

function SecondPage() {
  const {
    formData,
    postFormData,
    handleMainCategoryChange,
    handleCheckboxChange,
    def,
    setIsAnyError,
    hasErrors,
    handleInputChange,
  } = useContext(FormContext);

  const navigate = useNavigate();

  const handlePreviousState = () => {
    navigate("/");
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (hasErrors) {
      setIsAnyError(true);
      alert("خطا در اطلاعات!");
      return;
    }

    const result = await postFormData();
    if (result.success) {
      alert("اطلاعات با موفقیت ارسال شد");
      console.log("✅ Submitted:", formData);
    } else {
      alert("❌ ارسال اطلاعات با خطا مواجه شد");
    }
  };

  return (
    <>
      <form className="container card" onSubmit={handleForm} dir="rtl">
        <h1>مرحله دوم</h1>
        <h2 className="h2-form">اطلاعات پزشکی بیمار</h2>

        <div className="input-group">
          <label className="form-label">علت ارجاع به ICU</label>
          <select
            value={formData.selectedIcuReason}
            onChange={(e) =>
              handleMainCategoryChange("IcuReason", e.target.value)
            }
            className="form-input"
          >
            <option value="">انتخاب کنید</option>
            {def.baseIcuReason.map((item, i) => (
              <option key={i} value={item.symptom}>
                {item.symptom}
              </option>
            ))}
          </select>
        </div>

        {formData.selectedIcuReason && (
          <div className="checkbox-container">
            <h4>انتخاب علائم مرتبط:</h4>
            {def.baseIcuReason
              .find((item) => item.symptom === formData.selectedIcuReason)
              ?.subSymptom.map((sub, i) => (
                <div key={i} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`icu-reason-${i}`}
                    value={sub}
                    checked={formData.selectedIcuReasonSubcategories?.includes(
                      sub
                    )}
                    onChange={(e) =>
                      handleCheckboxChange("IcuReason", sub, e.target.checked)
                    }
                  />
                  <label htmlFor={`icu-reason-${i}`}>{sub}</label>
                </div>
              ))}
          </div>
        )}

        <div className="input-group">
          <label className="form-label">تشخیص اولیه پزشک</label>
          <select
            value={formData.selectedPrimaryDiagnosis}
            onChange={(e) =>
              handleMainCategoryChange("PrimaryDiagnosis", e.target.value)
            }
            className="form-input"
          >
            <option value="">انتخاب کنید</option>
            {def.firstDiagnosis.map((item, i) => (
              <option key={i} value={item.diagnosis}>
                {item.diagnosis}
              </option>
            ))}
          </select>
        </div>

        {formData.selectedPrimaryDiagnosis && (
          <div className="checkbox-container">
            <h4>تشخیص‌های فرعی:</h4>
            {def.firstDiagnosis
              .find(
                (item) => item.diagnosis === formData.selectedPrimaryDiagnosis
              )
              ?.subDiagnosis.map((sub, i) => (
                <div key={i} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`diag-${i}`}
                    value={sub}
                    checked={formData.selectedPrimaryDiagnosisSubcategories?.includes(
                      sub
                    )}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "PrimaryDiagnosis",
                        sub,
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor={`diag-${i}`}>{sub}</label>
                </div>
              ))}
          </div>
        )}

        <div className="input-group">
          <label className="form-label">سابقه بیماری زمینه‌ای</label>
          <select
            value={formData.selectedComorbidity}
            onChange={(e) =>
              handleMainCategoryChange("Comorbidity", e.target.value)
            }
            className="form-input"
          >
            <option value="">ندارد</option>
            {def.comorbidities.map((item, i) => (
              <option key={i} value={item.comorbiditie}>
                {item.comorbiditie}
              </option>
            ))}
          </select>
        </div>

        {formData.selectedComorbidity && (
          <div className="checkbox-container">
            <h4>بیماری‌های زمینه‌ای:</h4>
            {def.comorbidities
              .find(
                (item) => item.comorbiditie === formData.selectedComorbidity
              )
              ?.subComorbiditie.map((sub, i) => (
                <div key={i} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`comorb-${i}`}
                    value={sub}
                    checked={formData.selectedComorbiditySubcategories?.includes(
                      sub
                    )}
                    onChange={(e) =>
                      handleCheckboxChange("Comorbidity", sub, e.target.checked)
                    }
                  />
                  <label htmlFor={`comorb-${i}`}>{sub}</label>
                </div>
              ))}
          </div>
        )}

        <div className="input-group">
          <label className="form-label">سوابق جراحی</label>
          <select
            value={formData.selectedSurgicalHistory}
            onChange={(e) =>
              handleMainCategoryChange("SurgicalHistory", e.target.value)
            }
            className="form-input"
          >
            <option value="">ندارد</option>
            {def.surgicalHistories.map((item, i) => (
              <option key={i} value={item.history}>
                {item.history}
              </option>
            ))}
          </select>
        </div>

        {formData.selectedSurgicalHistory && (
          <div className="checkbox-container">
            <h4>جزئیات جراحی:</h4>
            {def.surgicalHistories
              .find((item) => item.history === formData.selectedSurgicalHistory)
              ?.subHistory.map((sub, i) => (
                <div key={i} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`surg-${i}`}
                    value={sub}
                    checked={formData.selectedSurgicalHistorySubcategories?.includes(
                      sub
                    )}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "SurgicalHistory",
                        sub,
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor={`surg-${i}`}>{sub}</label>
                </div>
              ))}
          </div>
        )}

        <div className="input-group">
          <label className="form-label">داروهای مصرفی</label>
          <select
            value={formData.selectedMedication}
            onChange={(e) =>
              handleMainCategoryChange("Medication", e.target.value)
            }
            className="form-input"
          >
            <option value="">ندارد</option>
            {def.usedDrugs.map((item, i) => (
              <option key={i} value={item.drug}>
                {item.drug}
              </option>
            ))}
          </select>
        </div>

        {formData.selectedMedication && (
          <div className="checkbox-container">
            <h4>داروها:</h4>
            {def.usedDrugs
              .find((item) => item.drug === formData.selectedMedication)
              ?.subDrug.map((sub, i) => (
                <div key={i} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`drug-${i}`}
                    value={sub}
                    checked={formData.selectedMedicationSubcategories?.includes(
                      sub
                    )}
                    onChange={(e) =>
                      handleCheckboxChange("Medication", sub, e.target.checked)
                    }
                  />
                  <label htmlFor={`drug-${i}`}>{sub}</label>
                </div>
              ))}
          </div>
        )}

        <div className="input-group">
          <label className="form-label">آلرژی دارویی</label>
          <select
            value={formData.selectedDrugAllergy}
            onChange={(e) =>
              handleMainCategoryChange("DrugAllergy", e.target.value)
            }
            className="form-input"
          >
            <option value="">ندارد</option>
            {def.drugAllergies.map((item, i) => (
              <option key={i} value={item.allergy}>
                {item.allergy}
              </option>
            ))}
          </select>
        </div>

        {formData.selectedDrugAllergy && (
          <div className="checkbox-container">
            <h4>جزئیات آلرژی:</h4>
            {def.drugAllergies
              .find((item) => item.allergy === formData.selectedDrugAllergy)
              ?.subAllergy.map((sub, i) => (
                <div key={i} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`allergy-${i}`}
                    value={sub}
                    checked={formData.selectedDrugAllergySubcategories?.includes(
                      sub
                    )}
                    onChange={(e) =>
                      handleCheckboxChange("DrugAllergy", sub, e.target.checked)
                    }
                  />
                  <label htmlFor={`allergy-${i}`}>{sub}</label>
                </div>
              ))}
          </div>
        )}

        <div className="input-group">
          <label className="form-label">دلایل بستری ICU</label>
          <select
            value={formData.selectedIcuAdmissionReason}
            onChange={(e) =>
              handleMainCategoryChange("IcuAdmissionReason", e.target.value)
            }
            className="form-input"
          >
            <option value="">انتخاب کنید</option>
            {def.icuAdmissionReasons.map((item, i) => (
              <option key={i} value={item.reason}>
                {item.reason}
              </option>
            ))}
          </select>
        </div>

        {formData.selectedIcuAdmissionReason && (
          <div className="checkbox-container">
            <h4>جزئیات بستری:</h4>
            {def.icuAdmissionReasons
              .find(
                (item) => item.reason === formData.selectedIcuAdmissionReason
              )
              ?.subReason.map((sub, i) => (
                <div key={i} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`icuadm-${i}`}
                    value={sub}
                    checked={formData.selectedIcuAdmissionReasonSubcategories?.includes(
                      sub
                    )}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "IcuAdmissionReason",
                        sub,
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor={`icuadm-${i}`}>{sub}</label>
                </div>
              ))}
          </div>
        )}

        <div className="input-group">
          <label className="form-label">گروه خونی</label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">انتخاب کنید</option>
            {def.bloodTypes.map((type, i) => (
              <option key={i} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="form-label">نحوه ورود بیمار</label>
          <select
            name="modeOfArrival"
            value={formData.modeOfArrival}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">انتخاب کنید</option>
            {def.modeOfArrival.map((mode, i) => (
              <option key={i} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>

        <button className="form-button" type="submit">
          ارسال اطلاعات
        </button>
      </form>
      <button className="form-button" onClick={handlePreviousState}>
        مرحله قبل
      </button>
      <button
        type="button"
        onClick={exportPatientsForToday}
        className="form-button"
      >
        دانلود فایل اکسل امروز
      </button>
    </>
  );
}

export default SecondPage;
