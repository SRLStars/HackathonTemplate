1. To setup the environment for the project run our setup step:
   ```yaml
   - name: Setup environment
     uses: ./.github/actions/setup
     with:
       web_port:              ${{ vars.WEB_PORT }}
       mysql_root_password:   ${{ secrets.MYSQL_ROOT_PASSWORD }}
       mysql_database:        ${{ vars.MYSQL_DATABASE }}
       jwt_secret_key:        ${{ secrets.JWT_SECRET_KEY }}
       aws_access_key_id:     ${{ secrets.AWS_ACCESS_KEY_ID }}
       aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
       access_packages_pat:   ${{ secrets.ACCESS_PACKAGES_PAT }}

2. Implement the issue you were assigned to.
3. Before committing any change, run the tests and ensure all tests pass successfully. 
To run the tests:
   (i) From root, run: `pytest`
   (ii) From the web directory, run: `npm run test`
4. If tests fail, fix the new code and go back to step 3.
5. Commit the changes with a descriptive message.
6. Check the GitHub Actions tab to ensure the tests pass.
7. If not, back to step 3.