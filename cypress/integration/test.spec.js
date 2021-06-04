describe('Testing ALL GETs', () => {
   it('GET USERS', () => {
      cy.request('GET', 'http://localhost:3030/users')
   })
   it('GET SPRINTS', () => {
      cy.request('GET', 'http://localhost:3030/sprints')
   })
   it('GET PROJECTS', () => {
      cy.request('GET', 'http://localhost:3030/projects')
   })
   it('GET COMMENTS', () => {
      cy.request('GET', 'http://localhost:3030/comments')
   })
   it('GET TASKS', () => {
      cy.request('GET', 'http://localhost:3030/tasks')
   })
})