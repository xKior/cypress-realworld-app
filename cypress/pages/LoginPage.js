// cypress/pages/LoginPage.js

class LoginPage {
  // Selectores
  elements = {
    usernameInput: () => cy.get('[data-test="signin-username"]'),
    passwordInput: () => cy.get('[data-test="signin-password"]'),
    submitButton: () => cy.get('[data-test="signin-submit"]'),
    signInError: () => cy.get('[data-test="signin-error"]'),
    rememberMeCheckbox: () => cy.get('[data-test="signin-remember-me"]'),
    signUpLink: () => cy.contains('Don\'t have an account? Sign Up'),
    logoImage: () => cy.get('.makeStyles-logo-3'),
    welcomeText: () => cy.get('h1').contains('Sign in'),
  }

  // Acciones
  visit() {
    cy.visit('/signin');
    return this;
  }

  enterUsername(username) {
    this.elements.usernameInput().clear().type(username);
    return this;
  }

  enterPassword(password) {
    this.elements.passwordInput().clear().type(password);
    return this;
  }

  checkRememberMe() {
    this.elements.rememberMeCheckbox().check();
    return this;
  }

  clickSubmit() {
    this.elements.submitButton().click();
    return this;
  }

  clickSignUp() {
    this.elements.signUpLink().click();
    return this;
  }

  // Flujos completos
  login(username, password, rememberMe = false) {
    this.enterUsername(username);
    this.enterPassword(password);
    if (rememberMe) {
      this.checkRememberMe();
    }
    this.clickSubmit();
    return this;
  }

  // Verificaciones
  shouldShowError(errorMessage) {
    this.elements.signInError()
      .should('be.visible')
      .and('contain', errorMessage);
    return this;
  }

  shouldBeOnLoginPage() {
    cy.url().should('include', '/signin');
    this.elements.welcomeText().should('be.visible');
    return this;
  }

  shouldHaveSubmitButtonDisabled() {
    this.elements.submitButton().should('be.disabled');
    return this;
  }

  shouldHaveSubmitButtonEnabled() {
    this.elements.submitButton().should('not.be.disabled');
    return this;
  }

  // Validaciones de campos
  validateUsernameRequired() {
    this.elements.usernameInput().focus().blur();
    cy.contains('Username is required').should('be.visible');
    return this;
  }

  validatePasswordRequired() {
    this.elements.passwordInput().focus().blur();
    cy.contains('Password is required').should('be.visible');
    return this;
  }
}

export default LoginPage;