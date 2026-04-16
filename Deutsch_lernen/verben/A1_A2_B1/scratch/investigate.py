import os

verbs = ['zuordnen', 'ergänzen', 'markieren', 'unterstreichen', 'durchstreichen', 'ausfüllen', 'anprobieren', 'klingeln', 'überqueren', 'dabeihaben', 'abheben', 'umtauschen']
for v in verbs:
    path = f'json/cards/{v}.json'
    if os.path.exists(path):
        print(f'{v}: EXISTS')
    else:
        print(f'{v}: MISSING')
