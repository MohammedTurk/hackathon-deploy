import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  VerificationCard,
  VerifyMobileForm,
  VerifiedSuccess,
} from "features/verification";
import {
  useRecipientMobileCode,
  useSWRHook,
  useSwrMutationFetch,
  useSWRMutationHook,
} from "features/payout/hooks";
import { useCurrentUser } from "features/authentication";
import { Button, NoSsr } from "components";
import { API_SERVICES_URLS } from "data";

const VerifyPhoneOtp = ({
  closeModal,
  requestData,
  sendCodeData,
  closePrevModal,
  setRecipientDataState,
  urlReferch,
  precess,
  setBankList,
  sendCodePath,
  processRequestPath,
  ProcessRequestMethod,
}: {
  closeModal: () => void;
  requestData: {};
  sendCodeData:{};
  closePrevModal: () => void;
  setRecipientDataState: Dispatch<SetStateAction<never[]>>;
  setBankList:Dispatch<SetStateAction<never[]>>;
  urlReferch:string;
  precess:string,
  id?: number;
  sendCodePath: string;
  processRequestPath: string;
  ProcessRequestMethod: string;
}) => {
 
 
  

  const [isVerified, setIsVerified] = useState(false);

  const { trigger: sendCode, isMutating } = useSWRMutationHook(
    sendCodePath,
    "POST",
    { data: {...sendCodeData} }
  );

  const { trigger: sendProcessRequest, data } = useSWRMutationHook(
    processRequestPath,
    ProcessRequestMethod,
    { data: { ...requestData } }
  );



    const {trigger :newReq  } = useSwrMutationFetch(urlReferch , {method: "GET",headers:{}})
 
  useEffect(() => {
    sendCode();
  }, []);

  const onVerify =    async () => {
    setIsVerified(true);
   await sendProcessRequest();
    const response = await newReq();
    console.log("response", response);
    
    if(response.status == "failed") return
    if(precess === "AddRecipient" || precess === "EditRecipient"){
      setRecipientDataState(response.data)
    }else{

      setBankList(response.data)
    }
     
  };

  let imgSrc = "/assets/img/phone.png";
  const mobileCurrentUser = useCurrentUser()?.user?.mobile
  let caption: React.ReactNode = (
    <>
      Didn&apos;t get the code?{" "}
      <a onClick={() => sendCode()} className="text-blue-light cursor-pointer">
        {isMutating ? "Loading..." : "Resend"}
      </a>
    </>
  );
  let content = (
    <>
      <p className="text-sm text-gray-dark mb-4">
        We have sent you a verification code to your phone number {requestData?.mobile || mobileCurrentUser}
      </p>
      <VerifyMobileForm onVerify={onVerify} />
    </>
  );
  const handleClose = () => {
    // setRecipientDataState()
    closePrevModal();
    closeModal();
  };
  if (isVerified) {
    imgSrc = "/assets/img/check-mark.png";
    caption = null;
    content = (
      <>
        <p className="text-xl my-4 text-center">
          Your Request Is Completed
        </p>
        <Button
          type="submit"
          buttonSize="small"
          fullWidth
          onClick={handleClose}
        >
          Continue
        </Button>
      </>
    );
  }

  return (
    <NoSsr>
      <VerificationCard
        title="We need to make sure its you!"
        className="!max-w-full"
        imgSrc={imgSrc}
        caption={caption}
      >
        {content}
      </VerificationCard>
    </NoSsr>
  );
};

export default VerifyPhoneOtp;
