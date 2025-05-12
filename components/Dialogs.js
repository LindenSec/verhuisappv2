// CostDialog component
const CostDialog = ({ currentItemForCost, costValue, setCostValue, saveCost, skipCost, costInputRef }) => {
    if (!currentItemForCost) return null;
    
    return (
      <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-md max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-3">Kosten toevoegen</h3>
          <p className="mb-3 text-sm">Item: {currentItemForCost.name}</p>
          
          <div className="mb-3">
            <label className="block text-gray-700 mb-1 text-sm">Prijs (€)</label>
            <input
              ref={costInputRef}
              type="number"
              step="0.01"
              min="0"
              value={costValue}
              onChange={(e) => setCostValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveCost()}
              className="w-full p-2 border rounded"
              placeholder="0,00"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={saveCost}
              className="primary-button text-white px-4 py-2 rounded flex-grow"
            >
              Opslaan
            </button>
            <button
              onClick={skipCost}
              className="secondary-button text-white px-4 py-2 rounded"
            >
              Overslaan
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // CategoryForm component
  const CategoryForm = ({ 
    showCategoryForm, 
    setShowCategoryForm, 
    newCategoryName, 
    setNewCategoryName, 
    newCategoryShowIkea, 
    setNewCategoryShowIkea, 
    addCategory 
  }) => {
    if (!showCategoryForm) return null;
    
    return (
      <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-md max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-3">Nieuwe categorie toevoegen</h3>
          
          <div className="mb-3">
            <label className="block text-gray-700 mb-1 text-sm">Naam categorie</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              className="w-full p-2 border rounded"
              placeholder="Bijvoorbeeld: Huisdieren"
            />
          </div>
          
          <div className="mb-3">
            <label className="flex items-center text-gray-700 text-sm">
              <span className="mr-2">IKEA-integratie inschakelen</span>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={newCategoryShowIkea} 
                  onChange={(e) => setNewCategoryShowIkea(e.target.checked)} 
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
            <p className="mt-1 text-gray-500 text-xs">
              Schakel uit voor categorieën zoals nutsvoorzieningen waar geen IKEA-producten voor nodig zijn.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={addCategory}
              className="primary-button text-white px-4 py-2 rounded flex-grow"
            >
              Toevoegen
            </button>
            <button
              onClick={() => setShowCategoryForm(false)}
              className="secondary-button text-white px-4 py-2 rounded"
            >
              Annuleren
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // EditCategoryForm component (verbeterd)
const EditCategoryForm = ({ 
  showEditCategoryForm, 
  setShowEditCategoryForm, 
  editingCategory, 
  setEditingCategory, 
  categorySettings, 
  updateCategory 
}) => {
  if (!showEditCategoryForm || !editingCategory) return null;
  
  const currentShowIkea = categorySettings[editingCategory]?.showIkea ?? true;
  
  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-md max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-3">Categorie bewerken</h3>
        
        <div className="mb-3">
          <label className="block text-gray-700 mb-1 text-sm">Naam categorie</label>
          <input
            id="editCategoryName"
            type="text"
            defaultValue={editingCategory}
            className="w-full p-2 border rounded"
            placeholder="Categorienaam"
          />
          <p className="text-xs text-gray-500 mt-1">
            Wijzig de naam om deze categorie te hernoemen
          </p>
        </div>
        
        <div className="mb-3">
          <label className="flex items-center text-gray-700 text-sm">
            <span className="mr-2">IKEA-integratie inschakelen</span>
            <div className="toggle-switch">
              <input 
                id="editCategoryShowIkea"
                type="checkbox" 
                defaultChecked={currentShowIkea} 
              />
              <span className="toggle-slider"></span>
            </div>
          </label>
          <p className="mt-1 text-gray-500 text-xs">
            Schakel uit voor categorieën zoals nutsvoorzieningen waar geen IKEA-producten voor nodig zijn.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={updateCategory}
            className="primary-button text-white px-4 py-2 rounded flex-grow"
          >
            Opslaan
          </button>
          <button
            onClick={() => {
              setShowEditCategoryForm(false);
              setEditingCategory(null);
            }}
            className="secondary-button text-white px-4 py-2 rounded"
          >
            Annuleren
          </button>
        </div>
      </div>
    </div>
  );
};
  
  // AddItemForm component
  const AddItemForm = ({ 
    showAddForm, 
    setShowAddForm, 
    newItemText, 
    setNewItemText, 
    newItemCategory, 
    setNewItemCategory, 
    getCategories, 
    addItem 
  }) => {
    if (!showAddForm) return null;
    
    return (
      <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-md max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-3">Nieuw item toevoegen</h3>
          
          <div className="mb-3">
            <label className="block text-gray-700 mb-1 text-sm">Categorie</label>
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecteer een categorie</option>
              {getCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-gray-700 mb-1 text-sm">Item naam</label>
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              className="w-full p-2 border rounded"
              placeholder="Bijvoorbeeld: Gordijnen ophangen"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={addItem}
              className="primary-button text-white px-4 py-2 rounded flex-grow"
            >
              Toevoegen
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="secondary-button text-white px-4 py-2 rounded"
            >
              Annuleren
            </button>
          </div>
        </div>
      </div>
    );
  };

  // SuggestionsDialog component
const SuggestionsDialog = ({ 
  showSuggestions, 
  setShowSuggestions, 
  selectedCategory, 
  categorySettings, 
  addItemFromSuggestion 
}) => {
  if (!showSuggestions || !selectedCategory) return null;
  
  return (
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
  );
};