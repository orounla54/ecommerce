import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/search/${keyword}`);
      setKeyword('');
    } else {
      navigate('/products');
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex">
      <div className="relative flex-grow">
        <input
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder="Search products..."
          className="form-control pl-10 pr-4 py-2 w-full"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
      </div>
      <button
        type="submit"
        className="ml-2 btn btn-primary"
        aria-label="Search"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;