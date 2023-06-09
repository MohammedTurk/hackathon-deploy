import { Button, Card, Input, Modal, PhoneInput } from "components";
import { API_SERVICES_URLS, FORM_VALIDATION } from "data";
import { AddRecipientType } from "features/payout/types";
import { useToggle } from "hooks";
import { XMarkIconMini } from "lib/@heroicons";
import useForm, { Controller } from "lib/react-hook-form";
import { useEffect } from "react";

import { getFieldHelperText } from "utils";
import VerifyPhoneOtp from "../VerifyPhoneOtp";

export const ControlRecipient = ({
  closeModal: closePrevModal,
  setRecipientData,
  recipientForEdit,
  precess = "AddRecipient",
 
}: {
  closeModal: () => void;
  setRecipientData: React.Dispatch<React.SetStateAction<never[]>>;
  precess: string;
 
  recipientForEdit : {}
}) => {
  const { isOpen, closeModal: closeModalOtp, openModal } = useToggle();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    clearErrorOnChange,
    setValue,
  } = useForm<AddRecipientType>();
  useEffect(() => {
    if (recipientForEdit) {
      setValue("name", recipientForEdit.name);
      setValue("idNumber", recipientForEdit.idNumber);
      setValue("mobile", recipientForEdit.mobile);
    }
  }, [recipientForEdit]);
  const onSubmit = handleSubmit((data) => {
    openModal();
  });
 
 

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-10 mt-4">
        <h3 className="font-semibold text-xl">
          {recipientForEdit ? "Edit Recipient" : "Add Recipient"}
        </h3>
        <span
          className="h-5 w-5 cursor-pointer font-[700] "
          onClick={closePrevModal}
        >
          <XMarkIconMini />
        </span>
      </div>
      <form onSubmit={onSubmit}>
        <div>
          <p className="mb-1 text-gray-dark text-md font-medium">
            Recipients Full Name (Arabic)
          </p>
          <Input
            placeholder="الاسم ثلاثي بالعربي"
            id="name-input"
            inputSize="large"
            type="text"
            {...register("name", FORM_VALIDATION.firstName)}
            error={!!errors.name}
            helperText={getFieldHelperText("error", errors.name?.message)}
          />
        </div>

        <div>
          <Controller
            control={control}
            name="mobile"
            rules={{
              ...FORM_VALIDATION.mobile,
              onChange: () => clearErrorOnChange("mobile"),
            }}
            render={({ field: { ref, onChange, ...field } }) => (
              <PhoneInput
                id="phone-input"
                label="Phone Number"
                placeholder="Enter your phone number"
                inputSize="large"
                inputProps={{
                  ref,
                }}
                error={!!errors.mobile}
                helperText={getFieldHelperText("error", errors.mobile?.message)}
                onChange={(_, __, ___, value) => onChange(value)}
                {...field}
              />
            )}
          />
          {/* <Input
            placeholder="Enter phone number"
            id="name-input"
            inputSize="large"
            type="number"
            {...register("mobile", FORM_VALIDATION.mobile)}
            error={!!errors.mobile}
            helperText={getFieldHelperText("error", errors.mobile?.message)}
          /> */}
        </div>

        <div>
          <p className="mb-1 text-gray-dark text-md font-medium">
            Recipients ID Number (National ID or Passport)
          </p>
          <Input
            placeholder="Enter ID number"
            inputSize="large"
            id="idNumber"
            type="number"
            {...register("idNumber", FORM_VALIDATION.idNumber)}
            error={!!errors.idNumber}
            helperText={getFieldHelperText("error", errors.idNumber?.message)}
          />
        </div>
        <Button
          type="submit"
          className="w-[100%] mt-[21px] mb-[35px] text[16px] pl-[23px] pr-[23px] cursor-pointer font-[600]"
        >
          Confirm
        </Button>
      </form>
      <Modal isOpen={isOpen} closeModal={closeModalOtp}>
        <VerifyPhoneOtp
          
          closeModal={closeModalOtp}
          closePrevModal={closePrevModal}
          setRecipientDataState={setRecipientData}
          precess={precess}
          sendCodePath ={API_SERVICES_URLS.WITHDRAW.VERIFICATION.SEND_MOBILE_CODE_RECIPIENT}
          processRequestPath={precess === "EditRecipient"? API_SERVICES_URLS.WITHDRAW.EDIT_RECIPIENT(recipientForEdit?._id) : API_SERVICES_URLS.WITHDRAW.ADD_RECIPIENT }
          ProcessRequestMethod={precess === "EditRecipient" ? "PUT" :"POST"}
          requestData={{mobile :getValues("mobile"),idNumber:getValues("idNumber"),name:getValues("name"),code:"123456"}}
          sendCodeData={{mobile :getValues("mobile"),idNumber:getValues("idNumber")  }}
          urlReferch={API_SERVICES_URLS.WITHDRAW.RECIPIENT_LIST} 
         
         />
    
      </Modal>
    </div>
  );
};
export default ControlRecipient;
