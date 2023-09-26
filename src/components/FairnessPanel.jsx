import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

export const FairnessPanel = ({
  roundId,
  clientSeed,
  serverSeed,
  id,
  active,
  onClose,
}) => {
  const panelRef = useRef(null);
  const inputIdRef = useRef(null);
  const inputClientSeedRef = useRef(null);
  const inputServerSeedRef = useRef(null);

  useEffect(() => {
    let intId = setInterval(() => {
      if (panelRef.current) {
        if (active && !panelRef.current.classList.contains("active")) {
          onClose();
        }
      }
    }, 16);

    return () => {
      clearInterval(intId);
    };
  }, [active, onClose]);

  const copy = (target) => {
    if (target.current) {
      target.current.select();
      document.execCommand("copy");
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div
      id={id}
      className={"panel-container" + (active ? " active" : "")}
      ref={panelRef}
      onClick={(e) =>
        active &&
        !e.target.matches(".panel-center") &&
        !e.target.matches(".panel-center *") &&
        onClose()
      }
    >
      <div className="panel-center">
        <div className="title">
          <span>Fairness</span>
          <div className="close" onClick={() => onClose()}>
            <img src="/images/new_form/close.svg" alt="" />
          </div>
        </div>

        <div className="input-form">
          <div className="label">Round ID</div>
          <div className="input">
            <input
              type="text"
              readOnly={true}
              defaultValue={roundId}
              ref={inputIdRef}
            />
            <div className="copy" onClick={() => copy(inputIdRef)}>
              <img src="/images/new_form/copy.svg" alt="" />
            </div>
          </div>
        </div>

        <div className="input-form">
          <div className="label">Client Seed</div>
          <div className="input">
            <input
              type="text"
              readOnly={true}
              defaultValue={clientSeed}
              ref={inputClientSeedRef}
            />
            <div className="copy" onClick={() => copy(inputClientSeedRef)}>
              <img src="/images/new_form/copy.svg" alt="" />
            </div>
          </div>
        </div>

        <div className="input-form">
          <div className="label">Server Seed (Hashed)</div>
          <div className="input">
            <input
              type="text"
              readOnly={true}
              defaultValue={serverSeed}
              ref={inputServerSeedRef}
            />
            <div className="copy" onClick={() => copy(inputServerSeedRef)}>
              <img src="/images/new_form/copy.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
