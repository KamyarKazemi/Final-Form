import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import FormContext from "./FormContext";
import { exportPatientsForToday } from "./utils/exportToExcel";

function FirstPage() {
  const {
    setYears,
    handleBedNum,
    formData,
    handleInputChange,
    handleIdCode,
    handleName,
    handleAge,
    handlePhoneNumber,
    handleMedicalRecordNumber,
    handleInsurancePolicyNumber,
    handleEmergencyContactPhone,
    handleSecondEmergencyContactPhone,
    handleVitalSigns,
    handleWeight,
    handleHeight,
    handleGlasgowComaScale,
    handleApacheScore,
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
    handleYearChange,
    years,
    handleMonthChange,
    months,
    selectedMonth,
    handleDayChange,
    days,
    def,
    ageError,
    hasErrors,
    setIsAnyError,
    handleEmergencyContactName,
    emergancyContactNameError,
    doctors,
    handleDoctorChange,
    handleTimeOfWorkChange,
    handleNurseChange,
    nurses,
    handleHeightBlur,
    handleWeightBlur,
  } = useContext(FormContext);

  const navigate = useNavigate();

  const handleForm = (e) => {
    e.preventDefault();
    if (hasErrors) {
      setIsAnyError(true);
      alert("لطفا اطلاعات را به درستی وارد کنید!");
      return;
    }
    navigate("/second");
  };

  useEffect(() => {
    const yearList = [];
    for (let y = 1300; y <= 1404; y++) yearList.push(y);
    setYears(yearList);
  }, []);

  return (
    <>
      <form className="container card" onSubmit={handleForm}>
        <h1>مرحله اول</h1>
        <h2>اطلاعات هویتی بیمار</h2>

        <div className="input-group">
          <label className="form-label">کد ملی</label>
          <input
            name="idCode"
            value={formData.idCode}
            onChange={handleIdCode}
            className="form-input"
            required
          />
          {idError ? (
            <div className="idError">
              <p>کد ملی باید 10 رقم باشد</p>
            </div>
          ) : null}
        </div>

        <div className="input-group">
          <label className="form-label">نام</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleName}
            className="form-input"
            required
            readOnly
          />
        </div>

        <div className="input-group">
          <label className="form-label">نام خانوادگی</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleName}
            className="form-input"
            required
            readOnly
          />
        </div>

        <div className="input-group">
          <label className="form-label">شماره پرونده پزشکی</label>
          <input
            name="medicalRecordNumber"
            value={formData.medicalRecordNumber}
            onChange={handleMedicalRecordNumber}
            className="form-input"
            required
            readOnly
          />
          {medicalRecordError ? (
            <div className="idError">
              <p>شماره پرونده پزشکی نامعتبر است</p>
            </div>
          ) : null}
        </div>

        <div className="input-group">
          <label className="form-label">سن</label>
          <input
            name="age"
            value={formData.age}
            onChange={handleAge}
            className="form-input"
            required
            readOnly
          />
          {ageError ? (
            <div className="idError">
              <p>سن نامعتبر است</p>
            </div>
          ) : null}
        </div>

        <div className="input-group">
          <label className="form-label">شماره تماس</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handlePhoneNumber}
            className="form-input"
            required
            readOnly
          />
          {phoneNumberError ? (
            <div className="idError">
              <p>شماره تماس نامعتبر است</p>
            </div>
          ) : null}
        </div>

        <div className="input-group">
          <label className="form-label-2">تاریخ تولد (سال، ماه، روز)</label>

          <select
            onChange={handleYearChange}
            className="form-input"
            value={formData.birthDate?.split("/")?.[0] || ""}
            disabled
          >
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

          <select
            onChange={handleMonthChange}
            className="form-input"
            value={selectedMonth || ""}
            disabled
          >
            {months.map((m, i) => (
              <option key={i}>{m}</option>
            ))}
          </select>

          <select
            onChange={handleDayChange}
            className="form-input"
            value={formData.birthDate?.split("/")?.[2] || ""}
            disabled
          >
            {days.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="form-label">آدرس کامل</label>
          <textarea
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleInputChange}
            className="form-input"
            required
            readOnly
          />
        </div>

        <h2>اطلاعات بیمه</h2>

        <div className="input-group">
          <label className="form-label">شرکت بیمه</label>
          <select
            name="insuranceCompany"
            value={formData.insuranceCompany}
            onChange={handleInputChange}
            className="form-input"
            disabled
          >
            {def.insuranceCompanyOptions.map((item, i) => (
              <option key={i}>{item}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="form-label">شماره بیمه‌نامه</label>
          <input
            name="insurancePolicyNumber"
            value={formData.insurancePolicyNumber}
            onChange={handleInsurancePolicyNumber}
            className="form-input"
            readOnly
          />
          {insuranceError ? (
            <div className="idError">
              <p>شماره بیمه‌نامه باید 10 رقم باشد</p>
            </div>
          ) : null}
        </div>

        <h2>تماس اضطراری</h2>

        <div className="input-group">
          <label className="form-label">نام فرد همراه در مواقع اضطراری</label>
          <input
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleEmergencyContactName}
            className="form-input"
          />
          {emergancyContactNameError ? (
            <div className="idError">
              <p>نا معتبر</p>
            </div>
          ) : null}
        </div>

        <div className="input-group">
          <label className="form-label">
            شماره تماس فرد همراه در مواقع اضطراری
          </label>
          <input
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={handleEmergencyContactPhone}
            className="form-input"
          />
          {emergencyContactError ? (
            <div className="idError">
              <p>شماره تماس نامعتبر است</p>
            </div>
          ) : null}
        </div>

        <div className="input-group">
          <label className="form-label">
            شماره تماس فرد همراه در مواقع اضطراری (دوم)
          </label>
          <input
            name="secondEmergencyContactPhone"
            value={formData.secondEmergencyContactPhone}
            onChange={handleSecondEmergencyContactPhone}
            className="form-input"
          />
          {secondEmergencyContactError ? (
            <div className="idError">
              <p>شماره تماس نامعتبر است</p>
            </div>
          ) : null}
        </div>

        <div className="input-group">
          <label className="form-label">
            محل سکونت فرد همراه در مواقع اضطراری
          </label>
          <textarea
            name="emergencyContactAddress"
            value={formData.emergencyContactAddress}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <h2>ارزیابی بالینی</h2>

        <div className="input-group">
          <label className="form-label">لیست پزشکان در دسترس</label>
          <select
            className="form-input"
            value={formData.selectedDoctorId}
            onChange={handleDoctorChange}
          >
            <option value="">انتخاب کنید</option>
            {doctors.map((doc) => (
              <option
                key={`${doc.doctorIdCode}-${doc.specification}`}
                value={doc.doctorIdCode}
              >
                {doc.doctorFirstName} {doc.doctorLastName} - {doc.specification}
              </option>
            ))}
          </select>
        </div>

        {/* 🎓 Specification */}
        <div className="input-group">
          <label className="form-label">تخصص</label>
          <input
            type="text"
            className="form-input"
            value={formData.specification}
            readOnly
          />
        </div>

        {/* 🕐 Available Times */}
        {formData.selectedDoctorId && (
          <div className="input-group">
            <label className="form-label">زمان‌های در دسترس</label>
            <select
              className="form-input"
              value={formData.selectedTimeOfWork}
              onChange={handleTimeOfWorkChange}
            >
              <option value="">انتخاب کنید</option>
              {(
                doctors.find(
                  (d) => d.doctorIdCode === formData.selectedDoctorId
                )?.timeOfWork || []
              ).map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ⏰ Shift */}
        <div className="input-group">
          <label className="form-label">شیفت</label>
          <input
            type="text"
            className="form-input"
            value={formData.shift}
            readOnly
          />
        </div>

        {/* 🪪 Doctor ID */}
        <div className="input-group">
          <label className="form-label">کد ملی پزشک</label>
          <input
            type="text"
            className="form-input"
            value={formData.doctorIdCode}
            readOnly
          />
        </div>

        {/* 🏥 Medical System Code */}
        <div className="input-group">
          <label className="form-label">کد نظام پزشکی</label>
          <input
            type="text"
            className="form-input"
            value={formData.medicalSystemCode}
            readOnly
          />
        </div>

        <div className="input-group">
          <label className="form-label">لیست پرستاران</label>
          <select
            className="form-input"
            value={formData.selectedNurseId}
            onChange={handleNurseChange}
          >
            <option value="">انتخاب کنید</option>
            {nurses.map((n) => (
              <option key={n.nurseIdCode} value={n.nurseIdCode}>
                {n.firstName} {n.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="form-label">شیفت پرستار</label>
          <input
            type="text"
            className="form-input"
            value={formData.nurseShift}
            readOnly
          />
        </div>

        <div className="input-group">
          <label className="form-label">کد ملی پرستار</label>
          <input
            type="text"
            className="form-input"
            value={formData.nurseIdCode}
            readOnly
          />
        </div>

        <div className="input-group">
          <label className="form-label">کد نظام پزشکی پرستار</label>
          <input
            type="text"
            className="form-input"
            value={formData.nurseMedicalSystemCode}
            readOnly
          />
        </div>

        <div className="input-group">
          <label className="form-label">علائم حیاتی</label>
          <textarea
            name="vitalSignsOnAdmission"
            value={formData.vitalSignsOnAdmission}
            onChange={handleVitalSigns}
            className="form-input"
          />
          {vitalSignsError && (
            <div className="idError">
              <p>علائم حیاتی باید کامل باشد</p>
            </div>
          )}
        </div>

        <div className="input-group">
          <label className="form-label">شماره تخت</label>
          <input
            type="number"
            className="form-input"
            value={formData.bedNumber}
            onChange={handleBedNum}
            required
          />
        </div>

        <div className="input-group">
          <label className="form-label">وزن پذیرش</label>
          <input
            name="admissionWeight"
            value={formData.admissionWeight}
            onChange={handleWeight}
            className="form-input"
            onBlur={handleWeightBlur}
          />
          {weightError ? (
            <div className="idError">
              <p>وزن نامعتبر است</p>
            </div>
          ) : null}
        </div>

        <div className="input-group">
          <label className="form-label">قد پذیرش</label>
          <input
            name="admissionHeight"
            value={formData.admissionHeight}
            onChange={handleHeight}
            className="form-input"
            onBlur={handleHeightBlur}
          />
          {heightError ? (
            <div className="idError">
              <p>قد نامعتبر است</p>
            </div>
          ) : null}
        </div>

        <div className="input-group">
          <label className="form-label">GCS</label>
          <input
            name="glasgowComaScale"
            value={formData.glasgowComaScale}
            onChange={handleGlasgowComaScale}
            className="form-input"
          />
          {glasgowError ? (
            <div className="idError">
              <p>مقیاس GCS باید بین 3 تا 15 باشد</p>
            </div>
          ) : null}
        </div>

        <div className="input-group">
          <label className="form-label">APACHE II</label>
          <input
            name="apacheScore"
            value={formData.apacheScore}
            onChange={handleApacheScore}
            className="form-input"
          />
          {apacheError ? (
            <div className="idError">
              <p>امتیاز APACHE II باید بین 0 تا 71 باشد</p>
            </div>
          ) : null}
        </div>

        <button type="submit" className="form-button">
          مرحله بعد
        </button>
      </form>
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

export default FirstPage;
