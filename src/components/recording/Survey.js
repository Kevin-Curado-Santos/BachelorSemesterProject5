import "survey-core/defaultV2.min.css";
import { StylesManager, Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { preSurvey } from "../../constants/survey";

StylesManager.applyTheme("defaultV2");

export const PreSurvey = (props) => {
  const navigate = useNavigate();
  const survey = new Model(preSurvey);

  const surveyComplete = useCallback((sender) => {
    const anonId =
      "u" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 6);

    localStorage.setItem("anonId", anonId);

    const raw = sender.data;

    const genaiMap = {
      "I have heard of it": "heard",
      "I have used it": "used",
      "I have used it and I am a regular user": "regular",
      "I use it for my work": "work",
      "I am a Genai employee": "employee",
      "I have never heard of it": "none",
    };

    const educationMap = {
      "Some College": "some_college",
      "Bachelor's degree (4 yrs of college)": "ba",
      "Master's degree": "ma",
      "High school / GED": "hs",
      "Associate's degree (2 yrs of college)": "aa",
      "Less than high school": "lt_hs",
      "Doctoral degree": "phd",
      "Professional degree": "prof",
    };

    const payload = {
      anonId,
      genaiExperience: genaiMap[raw.genaiExperience] || "other",
      education: educationMap[raw.Education] || "other",
      artExperience: raw.artExperience || "unknown",
      timestamp: Date.now(),
    };

    fetch(`/api/saveSurvey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));

    // store anon in global state too
    props.dispatch({
      type: "update",
      controlName: "uid",
      newVal: anonId,
      uid: anonId,
    });

    navigate(props.nextLink);
  }, []);

  survey.onComplete.add(surveyComplete);

  return <Survey model={survey} />;
};
