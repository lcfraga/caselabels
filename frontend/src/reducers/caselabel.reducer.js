const caseLabelReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_LABELS_SUCCESS':
      return {
        done: state.done,
        loading: false,
        nextCase: state.nextCase,
        error: '',
        labels: action.payload,
        count: state.count,
        startedAt: state.startedAt,
      };

    case 'FETCH_LABELS_ERROR':
      return {
        done: state.done,
        loading: false,
        nextCase: state.nextCase,
        error: action.payload,
        labels: [],
        count: state.count,
        startedAt: state.startedAt,
      };

    case 'FETCH_CASE_SUCCESS':
      return {
        done: false,
        loading: false,
        nextCase: action.payload,
        error: null,
        labels: state.labels,
        count: state.count,
        startedAt: new Date(),
      };

    case 'FETCH_CASE_DONE':
      return {
        done: true,
        loading: false,
        nextCase: {},
        error: null,
        labels: [],
        count: state.count,
        startedAt: state.startedAt,
      };

    case 'FETCH_CASE_ERROR':
      return {
        done: false,
        loading: false,
        nextCase: {},
        error: action.payload,
        labels: state.labels,
        count: state.count,
        startedAt: state.startedAt,
      };

    case 'CASE_LABEL_SUCCESS':
      return {
        done: false,
        loading: false,
        nextCase: state.nextCase,
        error: null,
        labels: state.labels,
        count: state.count + 1,
        startedAt: state.startedAt,
      };

    case 'CASE_LABEL_ERROR':
      return {
        done: false,
        loading: false,
        nextCase: state.nextCase,
        error: action.payload,
        labels: state.labels,
        count: state.count,
        startedAt: state.startedAt,
      };

    default:
      return state;
  }
};

export default caseLabelReducer;
