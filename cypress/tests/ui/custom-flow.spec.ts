/// <reference types="cypress" />
import LoginPage from '../../pages/LoginPage';

describe('Custom user flow', () => {
  beforeEach(() => {
    // limpia sesión si aplica
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('logs in and performs a basic flow', () => {
    // usa credenciales de test (si el proyecto tiene fixtures o users de prueba)
    const email = Cypress.env('E2E_USER_EMAIL') || 'test@local.invalid';
    const password = Cypress.env('E2E_USER_PASSWORD') || 'password123';

    LoginPage.login(email, password);

    // espera y verifica que el login funcione
    LoginPage.assertLoggedIn();

    // ejemplo de flujo: navegar a "profile", editar y guardar
    cy.get('a[data-cy=profile-link]').click();
    cy.url().should('include', '/profile');

    cy.get('input[name="displayName"]').clear().type('Tester CI');
    cy.get('button[data-cy=save-profile]').click();

    cy.contains('Profile updated').should('be.visible');
  });
});
