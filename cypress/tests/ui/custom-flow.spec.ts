// cypress/tests/ui/custom-flow.spec.ts

import LoginPage from '../../pages/LoginPage';

describe('Custom Authentication Flow', () => {
  const loginPage = new LoginPage();
  
  // Usuarios de prueba (del seed data de la app)
  const validUser = {
    username: 'Katharina_Bernier',
    password: 's3cret'
  };

  beforeEach(() => {
    // Reset database y visitar login
    cy.task('db:seed');
    loginPage.visit();
  });

  describe('Login Functionality', () => {
    it('should successfully login with valid credentials', () => {
      loginPage
        .login(validUser.username, validUser.password)
        .shouldBeOnLoginPage();

      // Verificar redirección al dashboard
      cy.url().should('not.include', '/signin');
      cy.get('[data-test="sidenav-home"]').should('be.visible');
    });

    it('should show error with invalid credentials', () => {
      loginPage
        .login('invalid_user', 'wrong_password')
        .shouldShowError('Username or password is invalid');
    });

    it('should validate required fields', () => {
      loginPage
        .shouldHaveSubmitButtonDisabled()
        .validateUsernameRequired()
        .validatePasswordRequired();
    });

    it('should enable submit button when fields are filled', () => {
      loginPage
        .enterUsername(validUser.username)
        .enterPassword(validUser.password)
        .shouldHaveSubmitButtonEnabled();
    });

    it('should persist session with remember me', () => {
      loginPage.login(validUser.username, validUser.password, true);
      
      // Verificar cookie de sesión
      cy.getCookie('connect.sid').should('exist');
      
      // Recargar página y verificar que sigue logueado
      cy.reload();
      cy.get('[data-test="sidenav-home"]').should('be.visible');
    });
  });

  describe('Navigation Flow', () => {
    beforeEach(() => {
      loginPage.login(validUser.username, validUser.password);
    });

    it('should navigate to new transaction page', () => {
      cy.get('[data-test="nav-top-new-transaction"]').click();
      cy.url().should('include', '/transaction/new');
      cy.contains('Select Contact').should('be.visible');
    });

    it('should view personal transactions', () => {
      cy.get('[data-test="nav-personal-tab"]').click();
      cy.get('[data-test="transaction-list"]').should('be.visible');
    });

    it('should access account settings', () => {
      cy.get('[data-test="sidenav-user-settings"]').click();
      cy.url().should('include', '/user/settings');
      cy.contains('User Settings').should('be.visible');
    });
  });

  describe('Transaction Creation Flow', () => {
    beforeEach(() => {
      loginPage.login(validUser.username, validUser.password);
      cy.get('[data-test="nav-top-new-transaction"]').click();
    });

    it('should create a new payment transaction', () => {
      // Seleccionar contacto
      cy.get('[data-test^="user-list-item-"]').first().click();
      
      // Ingresar monto
      cy.get('[data-test="transaction-create-amount-input"]')
        .type('50.00');
      
      // Ingresar nota
      cy.get('[data-test="transaction-create-description-input"]')
        .type('Payment for lunch');
      
      // Enviar
      cy.get('[data-test="transaction-create-submit-payment"]').click();
      
      // Verificar transacción creada
      cy.contains('Paid $50.00 for lunch').should('be.visible');
      cy.get('[data-test="new-transaction-return-to-transactions"]').click();
      
      // Verificar que aparece en el listado
      cy.contains('Payment for lunch').should('be.visible');
    });

    it('should validate transaction amount', () => {
      cy.get('[data-test^="user-list-item-"]').first().click();
      
      // Intentar con monto inválido
      cy.get('[data-test="transaction-create-amount-input"]')
        .type('0');
      
      cy.get('[data-test="transaction-create-submit-payment"]')
        .should('be.disabled');
    });
  });

  describe('Logout Flow', () => {
    it('should successfully logout', () => {
      loginPage.login(validUser.username, validUser.password);
      
      cy.get('[data-test="sidenav-signout"]').click();
      
      // Verificar redirección a login
      cy.url().should('include', '/signin');
      loginPage.shouldBeOnLoginPage();
      
      // Verificar que la sesión se eliminó
      cy.getCookie('connect.sid').should('not.exist');
    });
  });

  describe('Responsive Design', () => {
    const viewports = [
      { device: 'iphone-x', width: 375, height: 812 },
      { device: 'ipad-2', width: 768, height: 1024 },
      { device: 'macbook-15', width: 1440, height: 900 }
    ];

    viewports.forEach((viewport) => {
      it(`should be functional on ${viewport.device}`, () => {
        cy.viewport(viewport.width, viewport.height);
        
        loginPage.login(validUser.username, validUser.password);
        
        // Verificar elementos clave visibles
        cy.get('[data-test="sidenav-home"]').should('exist');
        cy.get('[data-test="nav-top-new-transaction"]').should('exist');
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper ARIA labels on login form', () => {
      cy.get('[data-test="signin-username"]').should(($el) => {
        expect($el.attr('aria-label') || $el.attr('aria-labelledby')).to.exist;
      });
      
      cy.get('[data-test="signin-password"]').should(($el) => {
        expect($el.attr('aria-label') || $el.attr('aria-labelledby')).to.exist;
      });
    });

    it('should be keyboard navigable', () => {
      cy.get('body').type('{tab}');
      cy.focused().should('have.attr', 'data-test', 'signin-username');
      
      cy.focused().type('{tab}');
      cy.focused().should('have.attr', 'data-test', 'signin-password');
    });
  });
});