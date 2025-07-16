  export default function BankDetails({ formData, handleChange, handleStepChange, errors }) {
    return (
      <div className="row mt-2">
        <div className="col-md-4 col-sm-12 mb-3 position-relative">
          <label htmlFor="accountHolderName">
            Account Holder Name <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter account holder name"
            autoComplete="off"
            name="accountHolderName"
            id="accountHolderName"
            onChange={handleChange}
            value={formData.accountHolderName}
          />
          {errors.accountHolderName && (
            <span className="errors">{errors.accountHolderName}</span>
          )}
        </div>

        <div className="col-md-4 col-sm-12 mb-3 position-relative">
          <label htmlFor="accountNumber">
            Account Number <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter account number"
            autoComplete="off"
            name="accountNumber"
            id="accountNumber"
            onChange={handleChange}
            value={formData.accountNumber}
          />
          {errors.accountNumber && (
            <span className="errors">{errors.accountNumber}</span>
          )}
        </div>

        <div className="col-md-4 col-sm-12 mb-3 position-relative">
          <label htmlFor="ifscCode">
            IFSC Code <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter IFSC code"
            autoComplete="off"
            name="ifscCode"
            id="ifscCode"
            onChange={handleChange}
            value={formData.ifscCode}
          />
          {errors.ifscCode && (
            <span className="errors">{errors.ifscCode}</span>
          )}
        </div>

        <div className="col-md-4 col-sm-12 mb-3 position-relative">
          <label htmlFor="bankName">
            Bank Name <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter bank name"
            autoComplete="off"
            name="bankName"
            id="bankName"
            onChange={handleChange}
            value={formData.bankName}
          />
          {errors.bankName && (
            <span className="errors">{errors.bankName}</span>
          )}
        </div>

        <div className="col-md-4 col-sm-12 mb-3 position-relative">
          <label htmlFor="branchName">
            Branch Name <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter branch name"
            autoComplete="off"
            name="branchName"
            id="branchName"
            onChange={handleChange}
            value={formData.branchName}
          />
          {errors.branchName && (
            <span className="errors">{errors.branchName}</span>
          )}
        </div>

        <div className="col-md-4 col-sm-12 mb-3 position-relative">
          <label htmlFor="cancelledCheque">
            Cancelled Cheque <span className="required">*</span>
          </label>
          <input
            type="file"
            name="cancelledCheque"
            id="cancelledCheque"
            onChange={handleChange}
            accept="image/*,application/pdf"
          />
          {errors.cancelledCheque && (
            <span className="errors">{errors.cancelledCheque}</span>
          )}
        </div>
      </div>
    );
  }
