
import { ExamCategory } from '../../../DummyDatabase';
import MenuItems from './MenuItems';

import './NavbarCategories.css';

const NavbarCategories = () => {
  return (
    <nav>
      <ul className="menus">
        {ExamCategory.map((menu, index) => {
          const depthLevel = 0;
          return (
            <MenuItems
              items={menu}
              key={index}
              depthLevel={depthLevel}
            />
          );
        })}
      </ul>
    </nav>
  );
};

export default NavbarCategories;


