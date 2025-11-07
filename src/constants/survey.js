export const preSurvey = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          name: "Name",
          title: "Enter your name",
          type: "text",
          isRequired: true,
        },
        {
          name: "genaiExperience",
          title: "What is your experience with Genai?",
          type: "radiogroup",
          isRequired: false,
          choices: [
            "I have heard of it",
            "I have used it",
            "I have used it and I am a regular user",
            "I use it for my work",
            "I am a Genai employee",
            "I have never heard of it",
          ],
        },
        {
          name: "Education",
          title: "What's your highest attained education level?",
          type: "radiogroup",
          isRequired: false,
          choices: [
            "Some College",
            "Bachelor's degree (4 yrs of college)",
            "Master's degree",
            "High school / GED",
            "Associate's degree (2 yrs of college)",
            "Less than high school",
            "Doctoral degree",
            "Professional degree",
          ],
        },
        {
          name: "artExperience",
          title: "Do you currently or have you ever worked in a job that involves art? (ex. photographer, graphic designer, etc.)",
          type: "radiogroup",
          isRequired: false,
          choices: [
            "Yes",
            "No",
            "I am a hobbyist",
          ],
        },
      ],
    },
  ],
};
