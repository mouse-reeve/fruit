function fruit_fact(name, params) {
    var pit = params.pit_type == 'segment' ? 'seed' : params.pit_type;
    name = name.split(' ').slice(-1)[0].toLowerCase();

    var plural_name = name;
    if (['ch', 'ng', 'go', 'to'].indexOf(name.slice(-2)) > -1) {
        plural_name += 'es';
    } else if (name.slice(-1) == 'y') {
        plural_name = plural_name.slice(0, -1) + 'ies';
    } else {
        plural_name += 's';
    }

    var grammar_data = {
        'start': [
            '#name# #edible_part# #description#',
            '#name# #edible_part# #description#',
            '#name# #edible_part# #description#',
            '#name# #edible_part# #description#',
            '#name# #edible_part# #description#',
            '#name# #edible_part# #description#',
            '#name# #edible_part# #description#',
            '#plural_name# are #preparation#',
            '#plural_name# are #preparation#',
            '#plural_name# are #preparation#',
            '#plural_name# are #preparation#',
            '#plural_name# are #preparation#',
            '#plural_name# are #preparation#',
            '#plural_name# are #preparation#',
            '#plural_name# work great in a #baked_good#',
            '#plural_name# are a perfect pick if you\'re making a #baked_good#',
            '#plural_name# are a great addition to any #baked_good#',
            'Try using #plural_name# in a #baked_good# for a tasty twist',
            '#plural_name# are a popular ingredient in #baked_good#s',
            '#plural_name# are a popular ingredient in #baked_good#s',
            '#plural_name# are popular in #baked_good#s',
            '#plural_name# #origin#',
            '#misc#',
        ],
        'name': name,
        'plural_name': plural_name,
        'pit': pit,
        'misc': [
            '#name# #inedible_part# contain #chemical_quantity# #chemical_part#',
            '#name# #inedible_part# are not biodegradable',
            'Do not eat #plural_name#',
            '#plural_name# are now extinct',
            '#plural_name# are a sign of ill fortune.',
            '#plural_name# bring good luck',
            'It is a crime to cultivate #plural_name#',
            'There have been no confirmed sightings of #plural_name# in the past 50 years',
            '#plural_name# are not safe for children',
            'Eating #plural_name# can cause #drug_effect# and #drug_effect_2#',
            '#name# #inedible_part# can be dried and smoked to induce #drug_effect_2#',
            'Stay away from #plural_name#',
            '#plural_name# are a symbol of death',
        ],
        'drug_effect': [
            'euphoria',
            'light-headedness',
            'anxiety',
            'alertness',
            'hyper-alertness',
            'drowsiness',
            'dizziness',
            'confusion',
            'disorientation',
            'depression',
            'lethargy',
            'hyperactivity',
            'increased energy',
            'heart palpitations',
            'numbness',
        ],
        'drug_effect_2': [
            'hallucinations',
            'delusions',
            'complascence',
            'a sense of calm',
            'panic',
            'vomitting',
            'out of body experiences',
            'a sense of wellbeing',
            'itching',
            'warmth',
            'introspection',
            'visions of the future',
            'visions of the past',
            'psychic phenomenon',
            'dislocation in space',
            'dysphoria',
            'terror',
            'calmness',
            'auditory hallucinations',
        ],
        'baked_good': [
            'fresh fruit tart',
            'loaf cake',
            'quickbread',
            'fruitcake',
            'compote',
            'fruit pie',
            'fruit smoothie',
            'fruit smoothie',
            'fruit smoothie',
            'fruit cobbler',
            'sorbet',
            'sorbet',
            'sorbet',
            'sorbet',
            'sorbet',
            'cocktail',
            'cocktail',
            'pie',
            'pie',
            'pie',
            'pie',
            'tart',
        ],
        'origin': [
            'were created from scratch in a lab using CRISPR technology',
            'are a genetically engineered crop',
            'are an heirloom crop',
            'are the product of extensive gene editing',
            'were developed through years of selective breeding',
            'are a hybrid fruit that cannot propogate on its own',
            'were discovered growing wild in the late 21st century',
            'contain part of the #critter# DNA sequence',
            'are part of the biodiversity restoration initiative',
        ],
        'critter': [
            'human', '#animal#'
        ],
        'animal': [
            'dog', 'cat', 'rabbit', 'hamster', 'guinnea pig',
            'squirrel', 'deer', 'racoon', 'possum', 'coyote',
            'groundhog', 'meerkat', 'badger', 'fish',
            'seagull', 'pigeon', 'rat', 'bat',
        ],
        'chemical_quantity': [
            'trace amounts of',
            'traces of'
        ],
        'chemical_part': [
            'pharmaceutical waste',
            'gallium', 'selenium', 'cobalt', 'chlorine', 'barium',
            'arsenic', 'uranium', 'plutonium', 'cyanide',
            'lithium', 'formaldehyde', 'cadmium', 'mercury',
            'chromium', 'lead', 'manganese', 'polonium', 'radium',
            'beryllium', 'thallium',
        ],
        'preparation': [
            'traditionally cooked into paste and used as a spread',
            'must be cooked until they are soft enough to eat',
            'usually dried and powdered',
            'dried before they are eaten',
            'commonly fermented',
            'used to make wine',
            'a popular fruit base for jams and jellies',
            'best eaten when they are past ripe and beginning to rot',
            'commonly pickled in brine',
            'available canned and stewed in syrup',
            'served while still underipe',
        ],
        'inedible_part': [
            '#pit#s', '#pit#s', '#pit#s', '#pit#s', '#pit#s',
            'peels', 'rinds',
        ],
        'edible_part': [
            'skin', 'peel', 'rind',
            'flesh', 'pulp',
        ],
        'description': [
            'has #taste# taste',
            'is known for its #taste_part# flavor',
            'is prized for its #taste_part# flavor',
        ],
        'taste': [
            '#taste_modifier# #taste_part#',
        ],
        'taste_part': [
            'sweet', 'sugary', 'syrupy', 'sweet', 'sugary', 'honey-like',
            'pungent',
            'caramel', 'chocolately', 'butterscotch',
            'buttery', 'rich', 'creamy',
            'sour', 'tangy', 'tart', 'bitter', 'zingy', 'tangy',
            'tannic', 'salty', 'savory',
        ],
        'taste_modifier': [
            'a lighlty', 'an intensely', 'a mild', 'an astringent', 'a mellow',
            'a complex,', 'a light,', 'a heavy,',
            'a bright,', 'a soft,', 'a warm,', 'a cool,',
            'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a',
        ],
    };
    if (params.pit_type == 'segments') {
        grammar_data.edible_part.push('pith');
    }
    var grammar = tracery.createGrammar(grammar_data);
    var fact = grammar.flatten('#start#').trim();
    return fact[0].toUpperCase() + fact.slice(1);
}
