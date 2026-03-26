/// <reference types="cypress" />

describe('Interview Tracker Pipeline & Validation', () => {
  beforeEach(() => {
    // Visit the app
    cy.visit('/');
    // We assume the user has to click "Get Started" and is either auto-logged in via mock or standard flow
    // In our app, if there's no auth currently forcing the home page, it just loads.
    cy.contains('Get Started').click();
    cy.visit('/interviews');
  });

  it('should display validation errors when submitting an empty form', () => {
    // 1. Open the "Add Company" modal
    cy.contains('button', 'Add Company').click();
    
    // 2. Click submit without filling anything
    cy.contains('button', 'Add Application').click();
    
    // 3. Verify validation error messages render immediately below the inputs
    cy.contains('Company Name is required').should('be.visible');
    cy.contains('Role is required').should('be.visible');
    cy.contains('CTC is required').should('be.visible');
  });

  it('should successfully add a company to the pipeline when valid', () => {
    cy.contains('button', 'Add Company').click();
    
    cy.get('input[name="name"]').type('Tesla');
    cy.get('input[name="role"]').type('Frontend Engineer');
    cy.get('input[name="ctc"]').type('30LPA');
    cy.get('select[name="priority"]').select('High');
    
    cy.contains('button', 'Add Application').click();
    
    // The modal should close and the Pipeline board should now contain Tesla
    cy.contains('Tesla').should('be.visible');
    cy.contains('Frontend Engineer').should('be.visible');
  });
});
