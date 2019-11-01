describe('My First Test', function() {
    beforeEach(() => {
      cy.visit('http://localhost:9000')
    })
      it('Should body exist', function() {
        cy.get('body')
          .should('be.visible')
      })
  
      it('Should contains title', function(){
        cy.get("h1")
        .should('have.text', `'Allo, 'Allo!`)
      })
    })