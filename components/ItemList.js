// ItemList component
const ItemList = ({ 
    filterCategory, 
    items, 
    toggleItemCompletion, 
    deleteItem, 
    searchIkea, 
    completeCategory,
    hasIkeaIntegration,
    editCategory,
    formatCurrency,
    showCompleted
  }) => {
    // Items groeperen per categorie
    const groupItemsByCategory = () => {
      const grouped = {};
      const filteredItems = items.filter(item => {
        const categoryMatch = filterCategory === 'Alle' || item.category === filterCategory;
        const completionMatch = showCompleted || !item.completed;
        return categoryMatch && completionMatch;
      });
      
      filteredItems.forEach(item => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      });
      
      return grouped;
    };
    
    const groupedItems = groupItemsByCategory();
    
    return (
      <div>
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="mb-6">
            <div className="flex justify-between items-center mb-2 category-header">
              <h2 className="text-lg font-semibold text-gray-800">{category}</h2>
              <div className="flex items-center">
                <div className="category-actions mr-3">
                  <button 
                    onClick={() => editCategory(category)}
                    className="text-gray-500 hover:text-gray-700 mr-2"
                    title="Bewerk categorie"
                  >
                    <EditIcon size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => completeCategory(category)}
                  className="text-xs primary-button text-white px-2 py-1 rounded"
                >
                  Alles afvinken
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {categoryItems.map(item => (
                <div 
                  key={item.id} 
                  className={`flex items-center p-3 border-b ${
                    item.completed ? 'bg-gray-50' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleItemCompletion(item.id)}
                    className="mr-3 flex-shrink-0"
                  >
                    {item.completed ? (
                      <CheckCircleIcon className="text-green-500" />
                    ) : (
                      <CircleIcon className="text-gray-400" />
                    )}
                  </button>
                  
                  <div className="flex-grow flex flex-col">
                    <span className={item.completed ? 'completed' : 'text-gray-800'}>
                      {item.name}
                    </span>
                    
                    {item.cost > 0 && (
                      <span className="cost-tag mt-1 inline-block">
                        <EuroIcon size={12} className="mr-1" />
                        {formatCurrency(item.cost)}
                      </span>
                    )}
                  </div>
                  
                  {hasIkeaIntegration(category) && (
                    <button
                      onClick={() => searchIkea(item)}
                      className="text-blue-500 ml-2"
                      title="Zoek op IKEA"
                    >
                      <ShoppingCartIcon />
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 ml-2"
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };