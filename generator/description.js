function fruit_fact(name, params) {
    var pit = params.pit_type == 'segment' ? 'seed' : params.pit_type;
    name = name.split(' ').slice(-1)[0].toLowerCase();
    var grammar_data = {
        'start': [
            '#name# #edible_part# #description#',
            '#name# #edible_part# #description#',
            '#name# #edible_part# #description#',
            '#name# #edible_part# #description#',
            '#name# #edible_part# #description#',
            '#name# #edible_part# #description#',
            '#name# #edible_part# #description#',
            '#name# is #always# #preparation#',
            '#name# is #always# #preparation#',
            '#name# is #always# #preparation#',
            '#name# is #always# #preparation#',
            '#name# is #always# #preparation#',
            '#name# is #always# #preparation#',
            '#name# is #always# #preparation#',
            '#name# works great in a #baked_good#',
            '#name# is a perfect pick if you\'re making a #baked_good#',
            '#name# is a great addition to any #baked_good#',
            'Try using #name# in a #baked_good# for a tasty twist',
            '#name# is a popular ingredient in #baked_good#s',
            '#name# is a popular ingredient in #baked_good#s',
            '#name# is popular in #baked_good#s',
            '#name# #origin#',
            '#name# #inedible_part# contains #chemical_quantity# #chemical_part#',
        ],
        'name': name,
        'pit': pit,
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
            'was created from scratch in a lab using CRISPR technology',
            'is a genetic engineered crop',
            'is the product of extensive gene editing',
            'was developed through years of selective breeding',
            'is a hybrid fruit that cannot propogate on its own',
            'was discovered growing wild in the late 21st century',
            'is an heirloom crop',
            'contains part of the #critter# DNA sequence',
            'is part of the biodiversity restoration initiative',
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
            'a small amount of',
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
        'always': [
            'usually', 'best when',
            'only edible when', 'most often served',
            'eaten raw or', 'eaten when it is',
        ],
        'preparation': [
            'pickled in brine',
            'made into jam',
            'stewed in syrup',
            'cooked into paste',
            'dried',
            'fermented',
            'cooked until soft',
            'dried and powdered',
            'fire roasted',
            'past ripe and beginning to rot',
            'very ripe',
            'not yet ripe',
        ],
        'inedible_part': [
            '#pit#s', '#pit#s', '#pit#s', '#pit#s', '#pit#s',
            'peel', 'rind',
        ],
        'edible_part': [
            'skin', 'peel', 'rind',
            'flesh', 'pulp',
        ],
        'description': [
            'has #taste# taste',
            'is very #taste_part#',
            'is known for its #taste# flavor',
        ],
        'taste': [
            '#taste_modifier# #taste_part#',
        ],
        'taste_part': [
            'sweet', 'sugary', 'syrupy', 'floral', 'rosy',
            'pungent', 'fresh',
            'caramel', 'chocolately', 'butterscotch',
            'buttery', 'rich', 'creamy',
            'sour', 'tangy', 'tart', 'bitter', 'zingy',
            'tannic', 'salty', 'savory',
        ],
        'taste_modifier': [
            'a lighlty', 'an intensely', 'a mild', 'an astringent',
            'acomplex,', 'a light,', 'a heavy,',
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
