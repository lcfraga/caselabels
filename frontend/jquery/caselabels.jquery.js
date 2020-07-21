const BACKEND_API_URL = 'http://localhost/api';

class CaseLabelsBackend {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.setupAjax();
  }

  setupAjax() {
    $.ajaxSetup({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      xhrFields: {
        withCredentials: true
      }
    });
  }

  postRegistration(data, onDone, onFail) {
    const dataJson = JSON.stringify(data)

    $.post(`${this.apiUrl}/users`, dataJson, null, 'json')
      .done(onDone)
      .fail(onFail);
  }

  postLogIn(data, onDone, onFail) {
    const dataJson = JSON.stringify(data);

    $.post(`${this.apiUrl}/sessions`, dataJson, null, 'json')
      .done(onDone)
      .fail(onFail);
  }

  postLogOut(onDone, onFail) {
    $.ajax(`${this.apiUrl}/sessions`, { method: 'DELETE' })
      .done(onDone)
      .fail(onFail);
  }

  getLabels(onDone, onFail) {
    $.get(`${this.apiUrl}/labels`, {}, null, 'json')
      .done(onDone)
      .fail(onFail);
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
  constructor(backend, loginFormController, registrationFormController, caseLabelFormController) {
    this.backend = backend;
    this.loginFormController = loginFormController;
    this.registrationFormController = registrationFormController;
    this.caseLabelFormController = caseLabelFormController;
    this.nextCase = {};
    this.label = null;
    this.startedAt = new Date();
  }

  handleLogInRequest() {
    this.loginFormController.onLogInRequest()
    this.registrationFormController.onLogInRequest()
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

  handleRegistration() {
    const data = this.registrationFormController.getRegistrationData();
    this.register(data);
  }

  handleRegistrationRequest() {
    this.loginFormController.onRegistrationRequest()
    this.registrationFormController.onRegistrationRequest()
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
      (data) => this.onLogInSuccess(data.data),
      () => this.onLogInError()
    );
  }

  logOut() {
    this.backend.postLogOut(
      () => console.log('Log out succeeded.'),
      () => console.error('Log out failed.')
    )
  }

  register(data) {
    this.backend.postRegistration(
      data,
      () => this.onRegistrationSuccess(),
      () => this.onRegistrationError()
    )
  }

  getLabels() {
    this.backend.getLabels(
      (data) => this.onGetLabelsSuccess(data.data),
      () => this.onGetLabelsError()
    );
  }

  getNextCase() {
    this.backend.getNextCase(
      (data) => this.onGetNextCaseSuccess(data.data),
      (error) => this.onGetNextCaseError(error)
    );
  }

  caseLabel() {
    const durationInMillis = new Date() - this.startedAt;

    this.backend.postCaseLabel(
      { caseId: this.nextCase.id, label: this.label, durationInMillis },
      () => this.onCaseLabelSuccess(),
      (error) => this.onCaseLabelError(error)
    );
  }

  onLogInSuccess(user) {
    this.loginFormController.onLogInSuccess();
    this.caseLabelFormController.onLogIn(user);

    this.getLabels();
  }

  onLogInError() {
    this.loginFormController.onLogInError();
  }

  onRegistrationSuccess() {
    this.registrationFormController.onRegistrationSuccess()
    this.loginFormController.onRegistrationSuccess()
  }

  onRegistrationError() {
    this.registrationFormController.onRegistrationError()
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

  onCaseLabelError(error) {
    if (error.status === 400) {
      this.getNextCase();
    } else {
      this.caseLabelFormController.onCaseLabelError();
    }
  }
}

class LoginFormView {
  constructor($formContainer) {
    this.$formContainer = $formContainer;
  }

  show() {
    this.$formContainer.show();
  }

  hide() {
    this.$formContainer.hide();
  }

  showErrorAlert() {
    this.$formContainer.find('div#login-error').show();
  }

  hideErrorAlert() {
    this.$formContainer.find('div#login-error').hide();
  }

  showRegistrationAlert() {
    this.$formContainer.find('div#registration-success').show();
  }

  hideRegistrationAlert() {
    this.$formContainer.find('div#registration-success').hide();
  }

  reset() {
    this.$formContainer.find('input#login-email, input#login-password').val('');
    this.hideErrorAlert();
    this.hideRegistrationAlert();
  }

  getData() {
    const email = this.$formContainer.find('input#login-email').val();
    const password = this.$formContainer.find('input#login-password').val();
    return { email, password };
  }
}

class LoginFormController {
  constructor(view) {
    this.view = view;
    this.view.reset();
  }

  getLogInData() {
    return this.view.getData();
  }

  onLogInRequest() {
    this.view.reset();
    this.view.show();
  }

  onLogInSuccess() {
    this.view.reset();
    this.view.hide();
  }

  onLogInError() {
    this.view.hideRegistrationAlert();
    this.view.showErrorAlert();
  }

  onLogOut() {
    this.view.reset();
    this.view.show();
  }

  onRegistrationRequest() {
    this.view.reset();
    this.view.hide();
  }

  onRegistrationSuccess() {
    this.view.reset();
    this.view.show();
    this.view.showRegistrationAlert();
  }
}

class RegistrationFormView {
  constructor($formContainer) {
    this.$formContainer = $formContainer;
  }

  show() {
    this.$formContainer.show();
  }

  hide() {
    this.$formContainer.hide();
  }

  showErrorAlert() {
    this.$formContainer.find('div#registration-error').show();
  }

  hideErrorAlert() {
    this.$formContainer.find('div#registration-error').hide();
  }

  reset() {
    this.$formContainer.find('input#registration-name, input#registration-email, input#registration-password').val('');
    this.hideErrorAlert();
  }

  getData() {
    const name = this.$formContainer.find('input#registration-name').val()
    const email = this.$formContainer.find('input#registration-email').val();
    const password = this.$formContainer.find('input#registration-password').val();

    return { name, email, password };
  }
}

class RegistrationFormController {
  constructor(view) {
    this.view = view;
    this.view.hide();
  }

  getRegistrationData() {
    return this.view.getData();
  }

  onLogInRequest() {
    this.view.reset();
    this.view.hide();
  }

  onRegistrationRequest() {
    this.view.reset();
    this.view.show();
  }

  onRegistrationSuccess() {
    this.view.reset();
    this.view.hide();
  }

  onRegistrationError() {
    this.view.showErrorAlert();
  }
}

class CaseLabelFormView {
  constructor($formContainer) {
    this.$formContainer = $formContainer;
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

  showErrorAlert(error) {
    this.$formContainer.find('div#caselabel-error').show();
    this.$formContainer.find('div#caselabel-error-message').text(error);
  }

  hideErrorAlert() {
    this.$formContainer.find('div#caselabel-error').hide();
  }

  showDoneAlert() {
    this.$formContainer.find('div#caselabel-done').show();
  }

  hideDoneAlert() {
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
    this.hideErrorAlert();
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
    const email = this.$formContainer.find('input#email').val();
    const password = this.$formContainer.find('input#password').val();
    return { email, password };
  }
}

class CaseLabelFormController {
  constructor(view) {
    this.view = view;
    this.view.hide()
    this.view.disableSubmit()
  }

  getCaseLabelData() {
    return this.view.getData();
  }

  onLogIn(user) {
    this.view.setUser(user);
    this.view.show();
    this.view.showForm();
    this.view.hideDoneAlert();
    this.view.hideErrorAlert();
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
    this.view.showErrorAlert('Failed to load labels.');
  }

  onNextCaseSuccess(nextCase) {
    this.view.setNextCase(nextCase);
    this.view.resetSelection();
    this.view.disableSubmit();
    this.view.hideErrorAlert();
  }

  onNextCaseError() {
    this.view.disableSubmit();
    this.view.showErrorAlert('Failed to load next case.');
  }

  onLabelSelected() {
    this.view.enableSubmit();
  }

  onCaseLabelError() {
    this.view.showErrorAlert('Failed to label case.');
  }

  onCaseLabelDone() {
    this.view.reset();
    this.view.hideForm();
    this.view.showDoneAlert();
  }
}

$(() => {
  const backend = new CaseLabelsBackend(BACKEND_API_URL);

  const $loginFormContainer = $('#login');
  const loginFormView = new LoginFormView($loginFormContainer);
  const loginFormController = new LoginFormController(loginFormView);

  const $registrationFormContainer = $('#registration')
  const registrationFormView = new RegistrationFormView($registrationFormContainer)
  const registrationFormController = new RegistrationFormController(registrationFormView)

  const $caseLabelFormContainer = $('#caselabel');
  const caseLabelFormView = new CaseLabelFormView($caseLabelFormContainer);
  const caseLabelController = new CaseLabelFormController(caseLabelFormView);

  const app = new CaseLabelsApp(
    backend,
    loginFormController,
    registrationFormController,
    caseLabelController
  );

  $loginFormContainer.find('#login-form').on('submit', (event) => {
    event.preventDefault();
    app.handleLogIn(event);
  });

  $loginFormContainer.find('#registration-link').on('click', (event) => {
    event.preventDefault();
    app.handleRegistrationRequest()
  });

  $registrationFormContainer.find('#registration-form').on('submit', (event) => {
    event.preventDefault();
    app.handleRegistration();
  });

  $registrationFormContainer.find('#login-link').on('click', (event) => {
    event.preventDefault();
    app.handleLogInRequest();
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
