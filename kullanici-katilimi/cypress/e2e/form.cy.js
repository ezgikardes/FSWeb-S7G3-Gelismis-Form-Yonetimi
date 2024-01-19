

describe('Form sayfası testleri', () => {
    beforeEach(() => {
     
      cy.visit('http://localhost:3000/')
    })
  
    it('Name alanına yazı yaz', () => {
        cy.get('input[name=name]').type('Ali')
        cy.get('input[name=name]').should('have.value', 'Ali');
    })

    it('Email alanına mail adresi yaz', () => {
        cy.get('input[name=email]').type('ali@veli.com')
    })

    it('Şifre alanına şifre yaz', () => {
        cy.get('input[name=password]').type('123456')

    })
    it('Kullanım şartlarını kabul et', () => {
        cy.get('input[name=toc]').check()
        cy.get('input[name=toc]').should('be.checked')
    })
    it('Form gönder', () => {
        cy.get('input[name=name]').type('Ali')
        cy.get('input[name=name]').should('have.value', 'Ali');
        cy.get('input[name=email]').type('ali@veli.com')
        cy.get('input[name=password]').type('123456')
        cy.get('input[name=toc]').check()
        cy.get('input[name=toc]').should('be.checked')
        cy.get("#user-form-button").should("be.enabled")
        cy.get("#user-form-button").click()
    })

    


  
  })
  