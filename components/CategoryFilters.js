// CategoryFilters component
const CategoryFilters = ({ filterCategory, setFilterCategory, getCategories, setShowCategoryForm }) => (
    <div className="mt-3 flex scrollable-tabs pb-2">
      <button
        onClick={() => setFilterCategory('Alle')}
        className={`whitespace-nowrap px-3 py-1 mr-2 rounded-full text-sm ${
          filterCategory === 'Alle' ? 'active-category' : 'category-button text-white'
        }`}
      >
        Alle
      </button>
      
      {getCategories().map(category => (
        <button
          key={category}
          onClick={() => setFilterCategory(category)}
          className={`whitespace-nowrap px-3 py-1 mr-2 rounded-full text-sm ${
            filterCategory === category ? 'active-category' : 'category-button text-white'
          }`}
        >
          {category}
        </button>
      ))}
      
      <button
        onClick={() => setShowCategoryForm(true)}
        className="whitespace-nowrap px-3 py-1 mr-2 rounded-full text-sm bg-green-600 text-white"
      >
        + Categorie
      </button>
    </div>
  );