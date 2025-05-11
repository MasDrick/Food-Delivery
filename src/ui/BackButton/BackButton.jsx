import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import s from "./BackButton.module.scss";

const BackButton = ({
  children = "Назад",
  fallbackPath = "/",
  replace = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Если есть история - идем назад, иначе на fallbackPath
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath, { replace });
    }
  };

  return (
    <button onClick={handleClick} className={s.backToHomeButton}>
      <ChevronLeft />
      {children}
    </button>
  );
};

export default BackButton;
