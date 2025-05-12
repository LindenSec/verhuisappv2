// Hoofdapplicatie
const App = () => {
  // State voor de app
  const [items, setItems] = useState([]);
  const [filterCategory, setFilterCategory] = useState('Alle');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showEditCategoryForm, setShowEditCategoryForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentItemForCost, setCurrentItemForCost] = useState(null);
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [costValue, setCostValue] = useState('');
  const [pendingCostItems, setPendingCostItems] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryShowIkea, setNewCategoryShowIkea] = useState(true);
  const [categorySettings, setCategorySettings] = useState({...categoryStructure});
  const [editingCategory, setEditingCategory] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Refs
  const costInputRef = useRef(null);
  
  // Items laden bij het starten
  useEffect(() => {
    const savedItems = localStorage.getItem('verhuisItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(initialItems);
    }

    // Categorie-instellingen laden
    const savedCategorySettings = localStorage.getItem('verhuisCategorySettings');
    if (savedCategorySettings) {
      setCategorySettings(JSON.parse(savedCategorySettings));
    }
    
    // Scroll handler
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Items opslaan bij wijzigingen
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('verhuisItems', JSON.stringify(items));
    }
  }, [items]);

  // Categorie-instellingen opslaan bij wijzigingen
  useEffect(() => {
    localStorage.setItem('verhuisCategorySettings', JSON.stringify(categorySettings));
  }, [categorySettings]);
  
  // Focus op kosteninvoerveld wanneer dialoog wordt geopend
  useEffect(() => {
    if (currentItemForCost && costInputRef.current) {
      costInputRef.current.focus();
    }
  }, [currentItemForCost]);
  
  // Berekenen totale voortgang
  const calculateProgress = () => {
    if (items.length === 0) return 0;
    const completedCount = items.filter(item => item.completed).length;
    return Math.round((completedCount / items.length) * 100);
  };
  
  // Berekenen totale kosten
  const calculateTotalCost = () => {
    return items.reduce((total, item) => total + (item.cost || 0), 0);
  };
  
  // Formatteren van valuta
  const formatCurrency = (amount) => {
    return '€' + parseFloat(amount).toFixed(2).replace('.', ',');
  };
  
  // Alle unieke categorieën verkrijgen
  const getCategories = () => {
    return [...new Set([...Object.keys(categorySettings), ...items.map(item => item.category)])];
  };
  
  // Item status wijzigen (afvinken/ontvinken)
  const toggleItemCompletion = (id) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    // Als item wordt afgevinkt, kosten dialoog tonen
    if (!item.completed) {
      // Item markeren als compleet
      setItems(items.map(item => 
        item.id === id ? { ...item, completed: true } : item
      ));
      
      // Kosten dialoog tonen
      setCurrentItemForCost(item);
      setCostValue('');
    } else {
      // Als item wordt uitgevinkt, kosten resetten
      setItems(items.map(item => 
        item.id === id ? { ...item, completed: false, cost: 0 } : item
      ));
    }
  };
  
  // Kosten opslaan
  const saveCost = () => {
    if (!currentItemForCost) return;
    
    const cost = parseFloat(costValue) || 0;
    
    setItems(items.map(item => 
      item.id === currentItemForCost.id ? { ...item, cost } : item
    ));
    
    closeAndContinueCostDialog();
  };
  
  // Kosten overslaan en doorgaan naar volgende item
  const skipCost = () => {
    closeAndContinueCostDialog();
  };
  
  // Kosten dialoog sluiten en verder gaan met volgende item
  const closeAndContinueCostDialog = () => {
    setCurrentItemForCost(null);
    setCostValue('');
    
    // Controleer of er een wachtrij is met items voor kosteninvoer
    if (pendingCostItems.length > 0) {
      const nextItemId = pendingCostItems[0];
      const nextItem = items.find(item => item.id === nextItemId);
      
      setPendingCostItems(pendingCostItems.slice(1));
      
      if (nextItem) {
        setCurrentItemForCost(nextItem);
      }
    }
  };
  
  // Alle items in een categorie afvinken
  const completeCategory = (category) => {
    const incompleteCategoryItems = items.filter(item => 
      item.category === category && !item.completed
    );
    
    if (incompleteCategoryItems.length === 0) return;
    
    // Markeer alle items in de categorie als voltooid
    setItems(items.map(item => 
      item.category === category ? { ...item, completed: true } : item
    ));
    
    // Als er één item was, direct vragen om kosten
    if (incompleteCategoryItems.length === 1) {
      setCurrentItemForCost(incompleteCategoryItems[0]);
    } 
    // Als er meerdere items zijn, eerste tonen en rest in wachtrij zetten
    else if (incompleteCategoryItems.length > 1) {
      setCurrentItemForCost(incompleteCategoryItems[0]);
      setPendingCostItems(incompleteCategoryItems.slice(1).map(item => item.id));
    }
  };
  
  // Item verwijderen
  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  // Nieuw item toevoegen - Fix voor input bug door component state te gebruiken
  const addItem = () => {
    if (newItemText.trim() === '' || newItemCategory.trim() === '') return;
    
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    
    const newItem = {
      id: newId,
      category: newItemCategory,
      name: newItemText,
      completed: false,
      cost: 0
    };
    
    setItems([...items, newItem]);
    setNewItemText('');
    setNewItemCategory('');
    setShowAddForm(false);
  };
  
  // Item toevoegen vanuit suggesties
  const addItemFromSuggestion = (suggestion) => {
    if (!selectedCategory) return;
    
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    
    const newItem = {
      id: newId,
      category: selectedCategory,
      name: suggestion,
      completed: false,
      cost: 0
    };
    
    setItems([...items, newItem]);
    setShowSuggestions(false);
  };
  
  // Toon suggesties voor een categorie
  const showSuggestionsForCategory = (category) => {
    setSelectedCategory(category);
    setShowSuggestions(true);
  };
  
  // Nieuwe categorie toevoegen
  const addCategory = () => {
    if (newCategoryName.trim() === '') return;
    
    // Controle of categorie al bestaat
    if (getCategories().includes(newCategoryName)) {
      alert(`Categorie "${newCategoryName}" bestaat al!`);
      return;
    }
    
    // Categorie-instellingen bijwerken
    setCategorySettings({
      ...categorySettings,
      [newCategoryName]: { 
        showIkea: newCategoryShowIkea,
        suggestions: []
      }
    });
    
    setNewCategoryName('');
    setNewCategoryShowIkea(true);
    setShowCategoryForm(false);
  };

  // Bestaande categorie bewerken
  const editCategory = (category) => {
    setEditingCategory(category);
    setShowEditCategoryForm(true);
  };

  // Categorie-instellingen updaten
  const updateCategory = () => {
    if (!editingCategory) return;

    // Controleer of de nieuwe naam al bestaat (behalve als het dezelfde naam is)
    const newName = document.getElementById('editCategoryName').value.trim();
    const showIkea = document.getElementById('editCategoryShowIkea').checked;

    if (newName === '') {
      alert('Categorienaam mag niet leeg zijn!');
      return;
    }

    if (newName !== editingCategory && getCategories().includes(newName)) {
      alert(`Categorie "${newName}" bestaat al!`);
      return;
    }

    // Update categorienaam in items
    if (newName !== editingCategory) {
      setItems(items.map(item => 
        item.category === editingCategory ? { ...item, category: newName } : item));
    }

    // Update categorie-instellingen
    const updatedSettings = {...categorySettings};
    
    // Verwijder oude sleutel als naam is veranderd
    if (newName !== editingCategory) {
      // Behoud suggesties
      const suggestions = updatedSettings[editingCategory]?.suggestions || [];
      delete updatedSettings[editingCategory];
      updatedSettings[newName] = { showIkea, suggestions };
    } else {
      updatedSettings[editingCategory] = { 
        ...updatedSettings[editingCategory],
        showIkea 
      };
    }
    
    setCategorySettings(updatedSettings);
    setShowEditCategoryForm(false);
    setEditingCategory(null);
  };
  
  // IKEA zoekfunctie
  const searchIkea = (item) => {
    const searchTerm = getSearchTerms(item);
    window.open(`https://www.ikea.com/nl/nl/search/?q=${encodeURIComponent(searchTerm)}`, '_blank');
  };
  
  // Controleer of IKEA-zoekfunctie beschikbaar is voor deze categorie
  const hasIkeaIntegration = (category) => {
    return categorySettings[category]?.showIkea ?? true;
  };
  
  // Zoektermen genereren voor IKEA - Verbeterde versie die bug oplost
  const getSearchTerms = (item) => {
    // Woorden extraheren uit de itemnaam
    const words = item.name.split(/[\s\(\)]+/);
    
    // Bepaalde woorden uitsluiten
    const excludedWords = ['voor', 'met', 'en', 'of', 'andere', 'evt.', 'etc.', 'kleine', 'grote'];
    
    // Woorden filteren
    let searchTerms = words.filter(word => 
      word.length > 2 && 
      !excludedWords.includes(word.toLowerCase())
    );

    // Als er woorden in de itemnaam gevonden zijn, gebruik dan alleen die woorden
    // zonder categorie-specifieke termen toe te voegen
    if (searchTerms.length > 0) {
      return searchTerms.slice(0, 3).join(' ');
    }
    
    // Alleen als er geen bruikbare woorden in de itemnaam zijn, terugvallen op categorie-specifieke termen
    // Categorie-specifieke termen
    const categoryTerms = {
      "Woonkamer": ["kast", "bank", "tafel", "gordijn"],
      "Keuken": ["keuken", "bestek", "pan", "opberg"],
      "Badkamer": ["badkamer", "handdoek", "douche"],
      "Slaapkamer": ["bed", "matras", "kussen", "kast"],
      "Werk-/Gamehoek": ["bureau", "stoel", "kabel", "lamp"],
    };
    
    // Als er geen bruikbare termen zijn in de itemnaam, gebruik dan categorie-specifieke termen
    if (categoryTerms[item.category]) {
      return categoryTerms[item.category].slice(0, 2).join(' ');
    }
    
    // Terugvallen op categorie als er geen termen zijn
    return item.category;
  };
  
  // Scroll naar boven
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Reset app data (verwijder alle items)
  const resetApp = () => {
    if (window.confirm('Weet je zeker dat je alle items wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
      setItems([]);
      localStorage.removeItem('verhuisItems');
    }
  };
  
  // Categoriebeheer icoon
  const CategoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"></path>
      <path d="M9 12h6"></path>
      <path d="M9 16h6"></path>
      <path d="M9 8h6"></path>
    </svg>
  );
  
  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      {/* Header met titel en voortgang */}
      <header className="app-header text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold flex items-center">
              <HomeIcon className="mr-2" /> Verhuischecklist
            </h1>
            <div className="flex items-center">
              <div className="mr-3 text-sm flex items-center">
                <EuroIcon className="mr-1" />
                <span>{formatCurrency(calculateTotalCost())}</span>
              </div>
              <button 
                onClick={() => setShowCompleted(!showCompleted)}
                className="primary-button p-2 rounded-full"
              >
                {showCompleted ? <CheckIcon /> : <XIcon />}
              </button>
            </div>
          </div>
          
          {/* Voortgangsbalk */}
          <div className="mt-3 progress-bar-bg rounded-full h-4 overflow-hidden">
            <div 
              className="progress-bar-fill h-full transition-all duration-500 ease-out"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className="text-center text-xs mt-1">
            {calculateProgress()}% voltooid
          </div>
          
          {/* Categorie filter */}
          <CategoryFilters 
            filterCategory={filterCategory} 
            setFilterCategory={setFilterCategory} 
            getCategories={getCategories}
            setShowCategoryForm={setShowCategoryForm}
          />
        </div>
      </header>

      {/* Hoofdinhoud */}
      <main className="max-w-md mx-auto p-4">
        {/* Categorieën beheren sectie - met animatie */}
        <div className={`category-manager ${showCategoryManager ? 'open' : ''}`}>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Categorieën beheren</h2>
              <button 
                onClick={() => setShowCategoryForm(true)}
                className="bg-green-500 text-white px-3 py-2 rounded flex items-center"
              >
                <span className="mr-1">+</span> Nieuwe categorie
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {getCategories().map(category => (
                <div key={category} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span>{category}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editCategory(category)}
                      className="text-blue-500 flex items-center category-edit-button"
                      title="Categorie bewerken"
                    >
                      <EditIcon size={16} /> <span className="ml-1 text-xs">Bewerken</span>
                    </button>
                    <button
                      onClick={() => showSuggestionsForCategory(category)}
                      className="text-gray-500 text-xs px-2 py-1 bg-gray-200 rounded"
                    >
                      Suggesties
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {items.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
            <h2 className="text-lg font-semibold mb-3">Welkom bij je Verhuischecklist!</h2>
            <p className="mb-4">Je hebt nog geen items toegevoegd. Begin met het toevoegen van items uit onze suggesties of maak je eigen items aan.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="primary-button text-white px-4 py-2 rounded"
            >
              Nieuw item toevoegen
            </button>
          </div>
        )}
        
        <ItemList 
          filterCategory={filterCategory}
          items={items}
          toggleItemCompletion={toggleItemCompletion}
          deleteItem={deleteItem}
          searchIkea={searchIkea}
          completeCategory={completeCategory}
          hasIkeaIntegration={hasIkeaIntegration}
          editCategory={editCategory}
          formatCurrency={formatCurrency}
          showCompleted={showCompleted}
        />
        
        {items.length > 0 && (
          <div className="mt-6 text-center">
            <button 
              onClick={resetApp}
              className="text-xs text-red-500"
            >
              Reset alle items
            </button>
          </div>
        )}
      </main>

      {/* Zwevende actieknoppen */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
        {isScrolled && (
          <button
            onClick={scrollToTop}
            className="secondary-button text-white p-3 rounded-full shadow-lg"
          >
            <ArrowUpIcon />
          </button>
        )}
        
        <button
          onClick={() => setShowCategoryManager(!showCategoryManager)}
          className={`p-3 rounded-full shadow-lg ${showCategoryManager ? 'bg-blue-500' : 'secondary-button'} text-white`}
          title={showCategoryManager ? "Sluit categoriebeheer" : "Open categoriebeheer"}
        >
          <CategoryIcon />
        </button>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="primary-button text-white p-4 rounded-full shadow-lg text-2xl"
        >
          +
        </button>
      </div>

      {/* Dialogen */}
      <CostDialog 
        currentItemForCost={currentItemForCost}
        costValue={costValue}
        setCostValue={setCostValue}
        saveCost={saveCost}
        skipCost={skipCost}
        costInputRef={costInputRef}
      />
      
      <AddItemForm 
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newItemText={newItemText}
        setNewItemText={setNewItemText}
        newItemCategory={newItemCategory}
        setNewItemCategory={setNewItemCategory}
        getCategories={getCategories}
        addItem={addItem}
      />
      
      <CategoryForm 
        showCategoryForm={showCategoryForm}
        setShowCategoryForm={setShowCategoryForm}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        newCategoryShowIkea={newCategoryShowIkea}
        setNewCategoryShowIkea={setNewCategoryShowIkea}
        addCategory={addCategory}
      />
      
      <EditCategoryForm 
        showEditCategoryForm={showEditCategoryForm}
        setShowEditCategoryForm={setShowEditCategoryForm}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        categorySettings={categorySettings}
        updateCategory={updateCategory}
      />
      
      {/* Suggesties dialoog */}
      {showSuggestions && selectedCategory && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-md max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-3">Suggesties voor {selectedCategory}</h3>
            
            <div className="mb-4 max-h-60 overflow-y-auto">
              {categorySettings[selectedCategory]?.suggestions?.length > 0 ? (
                <ul className="divide-y">
                  {categorySettings[selectedCategory].suggestions.map((suggestion, index) => (
                    <li key={index} className="py-2">
                      <div className="flex justify-between items-center">
                        <span>{suggestion}</span>
                        <button
                          onClick={() => addItemFromSuggestion(suggestion)}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Toevoegen
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Geen suggesties beschikbaar voor deze categorie.</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowSuggestions(false)}
                className="secondary-button text-white px-4 py-2 rounded"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
