// cypress/pages/LoginPage.js
class LoginPage {
  visit() {
    cy.visit('/login'); // ajusta la ruta si es otra
  }

  fillEmail(email) {
    cy.get('input[name="email"]').clear().type(email);
  }

  fillPassword(password) {
    cy.get('input[name="password"]').clear().type(password, { log: false });
  }

  submit() {
    cy.get('button[type="submit"]').click();
  }

  login(email, password) {
    this.visit();
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
  }

  assertLoggedIn() {
    // ejemplo simple: revisar que exista elemento del dashboard
    cy.get('[data-cy=dashboard]').should('exist');
  }
}

export default new LoginPage();
