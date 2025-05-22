
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Package, BarChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { INVENTORY_CATEGORIES, MEASUREMENT_UNITS, InventoryItem } from '@/types/inventory';

interface AddInventoryItemFormProps {
  onClose: () => void;
}

const AddInventoryItemForm = ({ onClose }: AddInventoryItemFormProps) => {
  const { addInventoryItem } = useAppContext();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'raw' | 'finished'>('raw');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [minimumLevel, setMinimumLevel] = useState('');
  const [cost, setCost] = useState('');

  const handleSubmit = () => {
    if (!name || !unit) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال جميع البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const quantityNum = Number(quantity);
    const minimumLevelNum = Number(minimumLevel);
    const costNum = Number(cost);

    if (isNaN(quantityNum) || isNaN(minimumLevelNum) || isNaN(costNum)) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال أرقام صحيحة للكمية والمستوى الأدنى والتكلفة",
        variant: "destructive"
      });
      return;
    }

    addInventoryItem({
      name,
      category,
      quantity: quantityNum,
      unit,
      minimumLevel: minimumLevelNum,
      cost: costNum
    });

    toast({
      title: "تم إضافة العنصر",
      description: `تم إضافة ${name} بنجاح إلى المخزون`
    });

    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">اسم العنصر</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>

      <div>
        <Label htmlFor="category">الفئة</Label>
        <Select onValueChange={(value) => setCategory(value as 'raw' | 'finished')} defaultValue={category}>
          <SelectTrigger>
            <SelectValue placeholder="اختر فئة" />
          </SelectTrigger>
          <SelectContent>
            {INVENTORY_CATEGORIES.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quantity">الكمية</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>

      <div>
        <Label htmlFor="unit">وحدة القياس</Label>
        <Select onValueChange={setUnit}>
          <SelectTrigger>
            <SelectValue placeholder="اختر وحدة قياس" />
          </SelectTrigger>
          <SelectContent>
            {MEASUREMENT_UNITS.map(unit => (
              <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="minimumLevel">المستوى الأدنى للتنبيه</Label>
        <Input
          id="minimumLevel"
          type="number"
          value={minimumLevel}
          onChange={(e) => setMinimumLevel(e.target.value)}
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>

      <div>
        <Label htmlFor="cost">التكلفة (للوحدة)</Label>
        <Input
          id="cost"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose} variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
          إلغاء
        </Button>
        <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
          إضافة عنصر
        </Button>
      </div>
    </div>
  );
};

interface AddTransactionFormProps {
  itemId: string;
  onClose: () => void;
}

const AddTransactionForm = ({ itemId, onClose }: AddTransactionFormProps) => {
  const { inventory, addInventoryTransaction } = useAppContext();
  const [type, setType] = useState<'add' | 'remove'>('add');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const item = inventory.find(i => i.id === itemId);

  const handleSubmit = () => {
    if (!quantity) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال الكمية",
        variant: "destructive"
      });
      return;
    }

    const quantityNum = Number(quantity);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال كمية صحيحة وموجبة",
        variant: "destructive"
      });
      return;
    }

    if (type === 'remove' && item && quantityNum > item.quantity) {
      toast({
        title: "خطأ في الكمية",
        description: "الكمية المطلوبة أكبر من المتاح في المخزون",
        variant: "destructive"
      });
      return;
    }

    addInventoryTransaction({
      itemId,
      type,
      quantity: quantityNum,
      notes: notes || (type === 'add' ? 'إضافة للمخزون' : 'صرف من المخزون')
    });

    toast({
      title: "تمت العملية",
      description: type === 'add' ? 
        `تم إضافة ${quantityNum} ${item?.unit} إلى المخزون` :
        `تم صرف ${quantityNum} ${item?.unit} من المخزون`
    });

    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="item">العنصر</Label>
        <Input
          id="item"
          value={item?.name || ''}
          disabled
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>

      <div>
        <Label htmlFor="currentQuantity">الكمية الحالية</Label>
        <Input
          id="currentQuantity"
          value={`${item?.quantity || 0} ${item?.unit || ''}`}
          disabled
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>

      <div>
        <Label htmlFor="type">نوع العملية</Label>
        <Select onValueChange={(value) => setType(value as 'add' | 'remove')} defaultValue={type}>
          <SelectTrigger>
            <SelectValue placeholder="نوع العملية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="add">إضافة للمخزون</SelectItem>
            <SelectItem value="remove">صرف من المخزون</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quantity">الكمية</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>

      <div>
        <Label htmlFor="notes">ملاحظات</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose} variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
          إلغاء
        </Button>
        <Button onClick={handleSubmit} className={type === 'add' ? "bg-green-500 hover:bg-green-600" : "bg-amber-500 hover:bg-amber-600"}>
          {type === 'add' ? 'إضافة للمخزون' : 'صرف من المخزون'}
        </Button>
      </div>
    </div>
  );
};

const Inventory = () => {
  const { 
    inventory, 
    transactions, 
    getLowInventoryItems,
    getItemTransactions,
    deleteInventoryItem, 
    getTotalInventoryValue, 
    getRawMaterialsValue, 
    getFinishedProductsValue 
  } = useAppContext();
  
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showLowStock, setShowLowStock] = useState(false);

  const lowStockItems = getLowInventoryItems();
  
  // Filter inventory items based on search query and category
  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesLowStock = !showLowStock || item.quantity <= item.minimumLevel;
    return matchesSearch && matchesCategory && matchesLowStock;
  });
  
  const handleOpenTransaction = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsTransactionDialogOpen(true);
  };
  
  const handleDeleteItem = (item: InventoryItem) => {
    if (confirm(`هل أنت متأكد من حذف ${item.name} من المخزون؟`)) {
      deleteInventoryItem(item.id);
      toast({
        title: "تم الحذف",
        description: `تم حذف ${item.name} من المخزون`,
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المخزون</h1>
        <Link to="/">
          <Button className="bg-blue-500 hover:bg-blue-600">
            لوحة المراقبة
          </Button>
        </Link>
      </div>
      
      <div className="stats grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">إجمالي قيمة المخزون</h3>
            <p className="text-2xl font-bold">{getTotalInventoryValue().toLocaleString()} جنيه</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">قيمة المنتجات النهائية</h3>
            <p className="text-2xl font-bold">{getFinishedProductsValue().toLocaleString()} جنيه</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50">
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">قيمة المواد الخام</h3>
            <p className="text-2xl font-bold">{getRawMaterialsValue().toLocaleString()} جنيه</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">العناصر منخفضة المخزون</h3>
            <p className="text-2xl font-bold">{lowStockItems.length}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">المخزون</TabsTrigger>
          <TabsTrigger value="transactions">سجل العمليات</TabsTrigger>
          <TabsTrigger value="low-stock">العناصر منخفضة المخزون</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600 gap-1">
                    <Plus size={18} /> إضافة عنصر جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>إضافة عنصر جديد للمخزون</DialogTitle>
                  </DialogHeader>
                  <AddInventoryItemForm onClose={() => setIsAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 md:w-2/3">
              <div className="w-full md:w-1/2">
                <Label htmlFor="categoryFilter">تصنيف</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="categoryFilter">
                    <SelectValue placeholder="جميع الفئات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    {INVENTORY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/2">
                <Label htmlFor="search">بحث</Label>
                <Input
                  id="search"
                  placeholder="ابحث في المخزون..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-right"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
          
          <Separator className="my-4 bg-gray-300" />
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-right">العنصر</th>
                  <th className="p-3 text-right">الفئة</th>
                  <th className="p-3 text-right">الكمية</th>
                  <th className="p-3 text-right">الحد الأدنى</th>
                  <th className="p-3 text-right">التكلفة الإجمالية</th>
                  <th className="p-3 text-right">آخر تحديث</th>
                  <th className="p-3 text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Package size={18} className={item.category === 'raw' ? "text-amber-500" : "text-green-500"} />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        {item.category === 'raw' ? 'مواد خام' : 'منتج نهائي'}
                      </td>
                      <td className={`p-3 ${item.quantity <= item.minimumLevel ? 'text-red-500 font-bold' : ''}`}>
                        {item.quantity} {item.unit}
                      </td>
                      <td className="p-3">{item.minimumLevel} {item.unit}</td>
                      <td className="p-3">{(item.quantity * item.cost).toLocaleString()} جنيه</td>
                      <td className="p-3">{item.lastUpdated}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => handleOpenTransaction(item.id)}>
                            <BarChart size={16} className="ml-1" /> حركة
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteItem(item)}>
                            <Trash2 size={16} className="ml-1" /> حذف
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      لا توجد عناصر متطابقة مع البحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-right">التاريخ</th>
                  <th className="p-3 text-right">العنصر</th>
                  <th className="p-3 text-right">العملية</th>
                  <th className="p-3 text-right">الكمية</th>
                  <th className="p-3 text-right">الملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => {
                    const item = inventory.find(i => i.id === transaction.itemId);
                    return (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{transaction.date}</td>
                        <td className="p-3">{item?.name || 'غير متاح'}</td>
                        <td className="p-3">
                          <span className={
                            transaction.type === 'add' 
                              ? 'bg-green-100 text-green-700 py-1 px-2 rounded-full' 
                              : 'bg-amber-100 text-amber-700 py-1 px-2 rounded-full'
                          }>
                            {transaction.type === 'add' ? 'إضافة' : transaction.type === 'remove' ? 'صرف' : 'تعديل'}
                          </span>
                        </td>
                        <td className="p-3">
                          {transaction.quantity} {item?.unit}
                        </td>
                        <td className="p-3">{transaction.notes}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      لا توجد سجلات حركة في المخزون
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="low-stock">
          <div className="overflow-x-auto">
            {lowStockItems.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-right">العنصر</th>
                    <th className="p-3 text-right">الفئة</th>
                    <th className="p-3 text-right">الكمية الحالية</th>
                    <th className="p-3 text-right">الحد الأدنى</th>
                    <th className="p-3 text-right">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Package size={18} className={item.category === 'raw' ? "text-amber-500" : "text-green-500"} />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        {item.category === 'raw' ? 'مواد خام' : 'منتج نهائي'}
                      </td>
                      <td className="p-3 text-red-500 font-bold">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="p-3">{item.minimumLevel} {item.unit}</td>
                      <td className="p-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-green-100 text-green-700 hover:bg-green-200"
                          onClick={() => handleOpenTransaction(item.id)}
                        >
                          <Plus size={16} className="ml-1" /> إضافة مخزون
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-10 text-center text-green-600 bg-green-50 rounded-md">
                <p className="text-lg font-semibold">لا توجد عناصر منخفضة المخزون</p>
                <p className="text-sm mt-2">جميع العناصر في المخزون بكميات كافية</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* نافذة إضافة حركة على العنصر */}
      <Dialog open={isTransactionDialogOpen && selectedItemId !== null} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة حركة على المخزون</DialogTitle>
          </DialogHeader>
          {selectedItemId && (
            <AddTransactionForm 
              itemId={selectedItemId} 
              onClose={() => {
                setIsTransactionDialogOpen(false);
                setSelectedItemId(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
