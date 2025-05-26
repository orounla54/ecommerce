import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginateProps {
  pages: number;
  page: number;
  isAdmin?: boolean;
  keyword?: string;
  categoryId?: string;
}

const Paginate = ({
  pages,
  page,
  isAdmin = false,
  keyword = '',
  categoryId,
}: PaginateProps) => {
  if (pages <= 1) return null;

  const getUrl = (p: number) => {
    if (isAdmin) {
      return `/admin/productlist/${p}`;
    } else if (keyword) {
      return `/products/search/${keyword}/page/${p}`;
    } else if (categoryId) {
      return `/products/category/${categoryId}/page/${p}`;
    } else {
      return `/products/page/${p}`;
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="flex space-x-1">
        {/* Previous page button */}
        {page > 1 && (
          <Link
            to={getUrl(page - 1)}
            className="inline-flex items-center justify-center w-9 h-9 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </Link>
        )}

        {/* Page numbers */}
        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            to={getUrl(x + 1)}
            className={`inline-flex items-center justify-center w-9 h-9 border rounded-md text-sm ${
              x + 1 === page
                ? 'bg-primary text-white border-primary'
                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            {x + 1}
          </Link>
        ))}

        {/* Next page button */}
        {page < pages && (
          <Link
            to={getUrl(page + 1)}
            className="inline-flex items-center justify-center w-9 h-9 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Paginate;