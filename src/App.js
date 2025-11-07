import './App.css';
import { useEffect, useReducer } from 'react';

import { PreSurvey } from './components/recording/Survey';
import { MicCheck } from './components/recording/MicCheck';
import { End } from './components/End';
import { createGlobalStyle } from 'styled-components';
import { Box } from '@mui/material';
import { Instruction } from './components/recording/Instruction';
import { FinalVideoSelection } from './components/recording/FinalVideoSelection';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SelectImagePage from './components/recording/SelectImagePage';
import SelectVideoPage from './components/recording/SelectVideoPage';
import RecordVideoPage from './components/recording/RecordVideoPage';
import AdminConfig from './components/admin/AdminConfig';

const GlobalStyle = createGlobalStyle`
  body {
    @media (max-width: 600px) {
      margin: auto;
      margin-top: 20px;
      padding: 5px;
    }
    margin: auto;
    margin-top: 50px;
    max-width: 1200px;
  }
`;

function reducer(state, action) {
  let newState = { ...state };
  if (action.type === 'update') {
    newState[action.controlName] = action.newVal;
  }
  return newState;
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    study_type: 'recording', // recording or comparison
    uid: 'unknown_uid',
    compare_idx: 0,
    max_compare_idx: 2,
  });

  const handleBrowserChange = (e) => {
    e.preventDefault();
    if (
      window.confirm(
        'Are you sure you want to leave? All your progress will be lost and the study will be terminated.'
      )
    ) {
      window.location.href = '/end';
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBrowserChange);
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBrowserChange);
  return () => {
      window.removeEventListener('popstate', handleBrowserChange);
      window.removeEventListener('beforeunload', handleBrowserChange);
  };
}, []);


  return (
    <>
      <GlobalStyle />
      <Box alignItems={'center'}>
        <Router>
          <Routes>
            <Route path={`/`} element={<Navigate to="/introduction" />} />
            {/* Pre-Survey */}
            <Route path={`/recording-pre-survey/`} element={ <PreSurvey nextLink={`/mic-check`} dispatch={dispatch} />} />

            {/* Introduction */}
            <Route path={`/introduction/`} element={<Instruction nextLink={`/recording-pre-survey`} />} />

            {/* Mic Check */}
            <Route path={`/mic-check/`} element={<MicCheck state={state} />}> </Route>

            {/* Thanks Page (always accessible) */}
            <Route path="/thanks" element={<End success />} />

            <Route path="/select-image" element={<SelectImagePage state={state} />} />

            {/* Study Round */}
            <Route path="/select-video" element={<SelectVideoPage state={state} />} />
            <Route path="/final-video-selection" element={<FinalVideoSelection />} />
            <Route path="/record-video" element={<RecordVideoPage state={state} />} />

            {/* End Page */}
            <Route path="/end" element={<End />} />

            {/* Admin Config Page */}
            <Route path="/admin/config" element={<AdminConfig />} />
          </Routes>
        </Router>
      </Box>
    </>
  );
}

export default App;
