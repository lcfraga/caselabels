const BACKEND_API_URL = 'http://localhost/api';

class CaseLabelsBackend {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.setAuthorizationHeader();
  }

  setAuthorizationHeader(value = '') {
    $.ajaxSetup({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', value);
      },
    });
  }

  postLogIn(data, onDone, onFail) {
    const dataJson = JSON.stringify(data);

    $.post(`${this.apiUrl}/users/login`, dataJson, null, 'json')
      .done(onDone)
      .fail(onFail);
  }

  getLabels(onDone, onFail) {
    $.get(`${this.apiUrl}/labels`, {}, null, 'json').done(onDone).fail(onFail);
  }

  getNextCase(onDone, onFail) {
    $.get(`${this.apiUrl}/cases/next`, {}, null, 'json')
      .done(onDone)
      .fail(onFail);
  }

  postCaseLabel(data, onDone, onFail) {
    const dataJson = JSON.stringify(data);

    $.post(`${this.apiUrl}/caselabels`, dataJson, null)
      .done(onDone)
      .fail(onFail);
  }
}

class CaseLabelsApp {
  constructor(backend, loginFormController, caseLabelFormController) {
    this.backend = backend;
    this.loginFormController = loginFormController;
    this.caseLabelFormController = caseLabelFormController;
    this.nextCase = {};
    this.label = null;
    this.startedAt = new Date();
    this.bypassLogin();
  }

  bypassLogin() {
    const userJson = localStorage.getItem('jUser');

    if (!userJson) {
      return;
    }

    const user = JSON.parse(userJson);
    this.onLogInSuccess(user);
  }

  handleLogIn() {
    const data = this.loginFormController.getLogInData();
    this.logIn(data);
  }

  handleLogOut() {
    this.caseLabelFormController.onLogOut();
    this.logOut();
    this.loginFormController.onLogOut();
  }

  handleLabelSelection(label) {
    this.label = label;
    this.caseLabelFormController.onLabelSelected();
  }

  handleCaseLabel() {
    this.caseLabel();
  }

  logIn(data) {
    this.backend.postLogIn(
      data,
      (data) => this.onLogInSuccess(data),
      () => this.onLogInError()
    );
  }

  logOut() {
    this.backend.setAuthorizationHeader();

    localStorage.removeItem('jUser');
  }

  getLabels() {
    this.backend.getLabels(
      (data) => this.onGetLabelsSuccess(data),
      () => this.onGetLabelsError()
    );
  }

  getNextCase() {
    this.backend.getNextCase(
      (data) => this.onGetNextCaseSuccess(data),
      (error) => this.onGetNextCaseError(error)
    );
  }

  caseLabel() {
    const durationInMillis = new Date() - this.startedAt;

    this.backend.postCaseLabel(
      { caseId: this.nextCase.id, label: this.label, durationInMillis },
      () => this.onCaseLabelSuccess(),
      () => this.onCaseLabelError()
    );
  }

  onLogInSuccess(user) {
    this.loginFormController.onLogInSuccess();
    this.caseLabelFormController.onLogIn(user);
    this.backend.setAuthorizationHeader(`Bearer ${user.token}`);

    const userJson = JSON.stringify(user);

    localStorage.setItem('jUser', userJson);

    this.getLabels();
  }

  onLogInError() {
    this.loginFormController.onLogInError();
  }

  onGetLabelsSuccess(labels) {
    this.caseLabelFormController.onLabelsSuccess(labels);
    this.getNextCase();
  }

  onGetLabelsError() {
    this.caseLabelFormController.onLabelsError();
  }

  onGetNextCaseSuccess(nextCase) {
    this.nextCase = nextCase;
    this.startedAt = new Date();
    this.caseLabelFormController.onNextCaseSuccess(nextCase);
  }

  onGetNextCaseError(error) {
    this.nextCase = {};

    if (error.status === 404) {
      this.caseLabelFormController.onCaseLabelDone();
    } else {
      this.caseLabelFormController.onNextCaseError();
    }
  }

  onCaseLabelSuccess() {
    this.nextCase = {};
    this.label = null;
    this.getNextCase();
  }

  onCaseLabelError() {
    this.caseLabelFormController.onCaseLabelError();
  }
}

class LoginFormView {
  constructor($formContainer) {
    this.$formContainer = $formContainer;
    this.hideError();
  }

  show() {
    this.$formContainer.show();
  }

  hide() {
    this.$formContainer.hide();
  }

  showError() {
    this.$formContainer.find('div#login-error').show();
  }

  hideError() {
    this.$formContainer.find('div#login-error').hide();
  }

  reset() {
    this.$formContainer.find('input#email, input#password').val('');
    this.hideError();
  }

  getData() {
    const email = this.$formContainer.find('input#email').val();
    const password = this.$formContainer.find('input#password').val();
    return { email, password };
  }
}

class LoginFormController {
  constructor(view) {
    this.view = view;
  }

  getLogInData() {
    return this.view.getData();
  }

  onLogInSuccess() {
    this.view.reset();
    this.view.hide();
  }

  onLogInError() {
    this.view.showError();
  }

  onLogOut() {
    this.view.show();
  }
}

class CaseLabelFormView {
  constructor($formContainer) {
    this.$formContainer = $formContainer;
    this.hide();
    this.disableSubmit();
  }

  enableSubmit() {
    this.$formContainer.find('button#caselabel-submit').prop('disabled', false);
  }

  disableSubmit() {
    this.$formContainer.find('button#caselabel-submit').prop('disabled', true);
  }

  show() {
    this.$formContainer.show();
  }

  hide() {
    this.$formContainer.hide();
  }

  showError(error) {
    this.$formContainer.find('div#caselabel-error').show();
    this.$formContainer.find('div#caselabel-error-message').text(error);
  }

  hideError() {
    this.$formContainer.find('div#caselabel-error').hide();
  }

  showDone() {
    this.$formContainer.find('div#caselabel-done').show();
  }

  hideDone() {
    this.$formContainer.find('div#caselabel-done').hide();
  }

  showForm() {
    this.$formContainer.find('form#caselabel-form').show();
  }

  hideForm() {
    this.$formContainer.find('form#caselabel-form').hide();
  }

  reset() {
    this.$formContainer.find('textarea#caselabel-case').val('');
    this.$formContainer.find('select#caselabel-label').empty();
    this.hideError();
  }

  resetSelection() {
    this.$formContainer
      .find('select#caselabel-label option:selected')
      .prop('selected', false);
  }

  setUser(user) {
    this.$formContainer
      .find('span#caselabel-user')
      .text(`Logged in as: ${user.name}`);
  }

  setLabels(labels) {
    labels.map((label) => {
      const labelText = `${label.description} (${label.code})`;
      const option = new Option(labelText, label.code);

      this.$formContainer.find('select#caselabel-label').append(option);
    });
  }

  setNextCase(nextCase) {
    this.$formContainer.find('textarea#caselabel-case').val(nextCase.content);
  }

  getData() {
    // const caseId;
    // const label;
    // const duration;
    const email = this.$formContainer.find('input#email').val();
    const password = this.$formContainer.find('input#password').val();
    return { email, password };
  }
}

class CaseLabelFormController {
  constructor(view) {
    this.view = view;
  }

  getCaseLabelData() {
    return this.view.getData();
  }

  onLogIn(user) {
    this.view.setUser(user);
    this.view.show();
    this.view.showForm();
    this.view.hideDone();
    this.view.hideError();
  }

  onLogOut() {
    this.view.reset();
    this.view.hide();
  }

  onLabelsSuccess(labels) {
    this.view.setLabels(labels);
  }

  onLabelsError() {
    this.view.disableSubmit();
    this.view.showError('Failed to load labels.');
  }

  onNextCaseSuccess(nextCase) {
    this.view.setNextCase(nextCase);
    this.view.resetSelection();
    this.view.disableSubmit();
    this.view.hideError();
  }

  onNextCaseError() {
    this.view.disableSubmit();
    this.view.showError('Failed to load next case.');
  }

  onLabelSelected() {
    this.view.enableSubmit();
  }

  onCaseLabelError() {
    this.view.showError('Failed to label case.');
  }

  onCaseLabelDone() {
    this.view.reset();
    this.view.hideForm();
    this.view.showDone();
  }
}

$(() => {
  const backend = new CaseLabelsBackend(BACKEND_API_URL);

  const $loginFormContainer = $('#login');
  const loginFormView = new LoginFormView($loginFormContainer);
  const loginFormController = new LoginFormController(loginFormView);

  const $caseLabelFormContainer = $('#caselabel');
  const caseLabelFormView = new CaseLabelFormView($caseLabelFormContainer);
  const caseLabelController = new CaseLabelFormController(caseLabelFormView);

  const app = new CaseLabelsApp(
    backend,
    loginFormController,
    caseLabelController
  );

  $loginFormContainer.find('#login-form').on('submit', (event) => {
    event.preventDefault();
    app.handleLogIn(event);
  });

  $caseLabelFormContainer.find('#logout-button').on('click', (event) => {
    event.preventDefault();
    app.handleLogOut();
  });

  $caseLabelFormContainer.find('#caselabel-form').on('submit', (event) => {
    event.preventDefault();
    app.handleCaseLabel();
  });

  $caseLabelFormContainer.find('#caselabel-label').on('change', (event) => {
    event.preventDefault();
    app.handleLabelSelection(event.target.value);
  });
});
