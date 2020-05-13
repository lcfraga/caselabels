import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import caseLabelReducer from '../reducers/caselabel.reducer';
import CaseLabelFormComponent from './caselabelform.component.js';
import CONFIG from '../config';

const initialState = {
  done: false,
  loading: true,
  error: '',
  nextCase: {},
  labels: [],
  count: 0,
  startedAt: new Date(),
};

const CaseLabelComponent = () => {
  const [state, dispatch] = useReducer(caseLabelReducer, initialState);

  useEffect(() => {
    axios
      .get(`${CONFIG.BACKEND_API_URL}/labels`)
      .then((response) => {
        dispatch({ type: 'FETCH_LABELS_SUCCESS', payload: response.data });
      })
      .catch((error) => {
        dispatch({
          type: 'FETCH_LABELS_ERROR',
          payload: 'Failed to retrieve labels.',
        });
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${CONFIG.BACKEND_API_URL}/cases/next`)
      .then((response) => {
        dispatch({ type: 'FETCH_CASE_SUCCESS', payload: response.data });
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          dispatch({ type: 'FETCH_CASE_DONE' });
        } else {
          dispatch({
            type: 'FETCH_CASE_ERROR',
            payload: 'Failed to retrieve case.',
          });
        }
      });
  }, [state.count]);

  const labelNextCase = (label) => {
    axios
      .post(`${CONFIG.BACKEND_API_URL}/caselabels`, {
        caseId: state.nextCase.id,
        label: label,
        durationInMillis: new Date() - state.startedAt,
      })
      .then((response) => {
        dispatch({ type: 'CASE_LABEL_SUCCESS' });
      })
      .catch((error) => {
        dispatch({
          type: 'CASE_LABEL_ERROR',
          payload: 'Failed to label case.',
        });
      });
  };

  return (
    <div>
      {state.done ? (
        <div className="alert alert-primary" role="alert">
          You're done.
        </div>
      ) : (
        <div>
          <CaseLabelFormComponent
            labels={state.labels}
            nextCase={state.nextCase}
            labelNextCase={labelNextCase}
          />
          {state.error ? (
            <div className="row">
              <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4">
                <div className="px-2">
                  <div className="alert alert-danger" role="alert">
                    {state.error}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
};

export default CaseLabelComponent;
