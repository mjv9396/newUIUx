export default function UploadDocuments({ formData, handleChange, handleStepChange, errors }) {
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    handleChange({ target: { name, value: files[0] } });
  };

  return (
    <div className="row mt-2">
      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="memorandumOfAssociation">
          Memorandum Of Association <span className="required">*</span>
        </label>
        <input
          type="file"
          name="memorandumOfAssociation"
          id="memorandumOfAssociation"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {errors.memorandumOfAssociation && (
          <span className="errors">{errors.memorandumOfAssociation}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="articlesOfAssociation">
          Articles Of Association <span className="required">*</span>
        </label>
        <input
          type="file"
          name="articlesOfAssociation"
          id="articlesOfAssociation"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {errors.articlesOfAssociation && (
          <span className="errors">{errors.articlesOfAssociation}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="certificateOfIncorporation">
          Certificate Of Incorporation <span className="required">*</span>
        </label>
        <input
          type="file"
          name="certificateOfIncorporation"
          id="certificateOfIncorporation"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {errors.certificateOfIncorporation && (
          <span className="errors">{errors.certificateOfIncorporation}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="merchantRegistrationForm">
          Merchant Registration Form <span className="required">*</span>
        </label>
        <input
          type="file"
          name="merchantRegistrationForm"
          id="merchantRegistrationForm"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {errors.merchantRegistrationForm && (
          <span className="errors">{errors.merchantRegistrationForm}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="gstCertificate">
          GST Certificate <span className="required">*</span>
        </label>
        <input
          type="file"
          name="gstCertificate"
          id="gstCertificate"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {errors.gstCertificate && (
          <span className="errors">{errors.gstCertificate}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="boardResolution">
          Board Resolution <span className="required">*</span>
        </label>
        <input
          type="file"
          name="boardResolution"
          id="boardResolution"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {errors.boardResolution && (
          <span className="errors">{errors.boardResolution}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="NCIFRegistrationForms">
          NCIF Registration Forms <span className="required">*</span>
        </label>
        <input
          type="file"
          name="NCIFRegistrationForms"
          id="NCIFRegistrationForms"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {errors.NCIFRegistrationForms && (
          <span className="errors">{errors.NCIFRegistrationForms}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="SubMerchantTemplates">
          Sub Merchant Templates <span className="required">*</span>
        </label>
        <input
          type="file"
          name="SubMerchantTemplates"
          id="SubMerchantTemplates"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {errors.SubMerchantTemplates && (
          <span className="errors">{errors.SubMerchantTemplates}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="BO">
          BO <span className="required">*</span>
        </label>
        <input
          type="file"
          name="BO"
          id="BO"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {errors.BO && (
          <span className="errors">{errors.BO}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="customerEnquiryQuestions">
          Customer Enquiry Questions <span className="required">*</span>
        </label>
        <input
          type="file"
          name="customerEnquiryQuestions"
          id="customerEnquiryQuestions"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {errors.customerEnquiryQuestions && (
          <span className="errors">{errors.customerEnquiryQuestions}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="officeBuildingPhoto">
          Office Building Photo <span className="required">*</span>
        </label>
        <input
          type="file"
          name="officeBuildingPhoto"
          id="officeBuildingPhoto"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {errors.officeBuildingPhoto && (
          <span className="errors">{errors.officeBuildingPhoto}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="officePhoto">
          Office Photo <span className="required">*</span>
        </label>
        <input
          type="file"
          name="officePhoto"
          id="officePhoto"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {errors.officePhoto && (
          <span className="errors">{errors.officePhoto}</span>
        )}
      </div>
    </div>
  );
}
