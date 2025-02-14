import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const usePasswordToggle = () => {
  const [visible, setVisible] = useState(false);

  const Icon = (
    <FontAwesomeIcon
      icon={visible ? faEye : faEyeSlash}
      onClick={() => setVisible(!visible)}
      style={{ cursor: "pointer" }}
    />
  );

  return { Icon, visible };
};
